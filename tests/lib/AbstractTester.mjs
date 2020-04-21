import FileSystem    from 'fs';
import { promisify } from 'util';
import test          from 'ava';
import LIVR          from 'livr';
import fsExt         from 'fs-ext';

import extraRules    from 'livr-extra-rules';

import initAllModels from '../../lib/domain-model/initModels.mjs';
import UseCaseBase   from '../../lib/use-cases/Base.mjs';
import appConfig     from '../../lib/config.cjs';

import TestFactory   from './TestFactory.mjs';

const fs = FileSystem.promises;
const flock = promisify(fsExt.flock);

const LOCK_FILE = '.ava-tests-mutex.lock';

// This function is needed to make linter alive for current file
// eslint-disable-next-line func-style
const lazyImport = (path) => import(path);

class Tester {
    constructor() {
        const { sequelize } = initAllModels(appConfig['test-db']);

        UseCaseBase.setSequelizeInstanse(sequelize); // TODO find a better way

        this.sequelize = sequelize;
        this.factory = new TestFactory();
        this._lockFH = null;
    }

    readTestDirs(rootDir) {
        // eslint-disable-next-line no-sync
        const items = FileSystem.readdirSync(rootDir, { withFileTypes: true });
        const dirs = items.filter(f => f.isDirectory()).map(f => f.name);

        return dirs;
    }

    async readTestData(rootDir, dir) {
        const files = (await fs.readdir(`${rootDir}/${dir}`, { withFileTypes: true }))
            .filter(f => f.isFile())
            .map(f => f.name);

        const data = {};

        for (const file of files) {
            const key = file.replace(/\..+$/, '');

            data[key] = await lazyImport(`${rootDir}/${dir}/${file}`);

            // TODO: change. Used for JSON imports and default exports
            if (data[key].default) {
                data[key] = data[key].default;
            }
        }

        return data;
    }

    setupTestsWithTransactions(rootDir, title, cb) {
        const dirs = this.readTestDirs(rootDir);

        let rootData = {};

        test.before(async () => {
            rootData = await this.readTestData(rootDir, '');
        });

        for (const dir of dirs) {
            // eslint-disable-next-line no-loop-func
            test.serial(`${title} ${dir}`, async (t) => {
                try {
                    const data = await this.readTestData(rootDir, dir);

                    // To allow to run several ava files in concurrent mode.
                    await this._lock();
                    await this.sequelize.transaction(async t1 => {
                        try {
                            this.testContext = t;
                            global.testTransaction = t1;

                            await cb({ ...rootData, ...data }); // eslint-disable-line callback-return
                        } catch (error) {
                            console.log(error);

                            throw error;
                        } finally {
                            global.testTransaction = null;
                            await t1.rollback();
                            await this._unlock();
                        }
                    });
                } catch (error) {
                    if (!error.message || !error.message.match(/rollback/)) {
                        throw error;
                    }
                }
            });
        }

        test.after(async () => {
            await this.sequelize.close();
        });
    }

    async testUseCasePositive() {
        throw new Error('testUseCasePositive is not implemented');
    }

    async testUseCaseNegative() {
        throw new Error('testUseCaseNegative is not implemented');
    }

    async _testUseCasePositiveAbstract({ serviceRunner, expected = {} } = {}, assert = this.testContext) {
        const got = await serviceRunner();
        const validator = new LIVR.Validator(expected);

        validator.registerRules(extraRules);
        validator.prepare();

        const validated = validator.validate(got);

        if (!validator.validate(got)) {
            const validationErrors = validator.getErrors();

            console.log(got);
            console.log(validationErrors);

            assert.is(validationErrors, {});
        }

        // For strict equality
        assert.deepEqual(got, validated);

        return got;
    }

    async _testUseCaseNegativeAbstract({ serviceRunner, exception = {} } = {}, assert = this.testContext) {
        const error = await serviceRunner();

        assert.deepEqual(error, exception);
    }

    async _lock() {
        this._lockFH = await fs.open(LOCK_FILE, 'r');
        await flock(this._lockFH.fd, 'ex');
    }

    async _unlock() {
        await this._lockFH.close();
        this._lockFH = null;
    }
}

export default Tester;

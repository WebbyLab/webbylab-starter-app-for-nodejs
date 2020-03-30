import FileSystem    from 'fs';
import test          from 'ava';
import LIVR          from 'livr';
import extraRules    from 'livr-extra-rules';

import initAllModels from '../../lib/domain-model/initModels.mjs';
import UseCaseBase   from '../../lib/use-cases/Base.mjs';
import appConfig     from '../../lib/config.cjs';
import { Exception } from '../../packages.mjs';

import TestFactory   from './TestFactory.mjs';

const fs = FileSystem.promises;

// This function is needed to make linter alive for current file
// eslint-disable-next-line func-style
const lazyImport = (path) => import(path);

class Tester {
    constructor() {
        const { sequelize } = initAllModels(appConfig['test-db']);

        UseCaseBase.setSequelizeInstanse(sequelize); // TODO find a better way

        global.sequelize = sequelize; // TODO find a better way

        this.sequelize = sequelize;
        this.factory = new TestFactory();
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

    setupTestsWithTransactions(rootDir, cb) {
        const dirs = this.readTestDirs(rootDir);

        let rootData = {};

        test.before(async () => {
            rootData = await this.readTestData(rootDir, '');
        });

        for (const dir of dirs) {
            // eslint-disable-next-line no-loop-func
            test.serial(`${rootDir} ${dir}`, async (t) => {
                try {
                    const data = await this.readTestData(rootDir, dir);

                    await this.sequelize.transaction(async t1 => {
                        try {
                            this.testContext = t;
                            global.testTransaction = t1;
                            await cb({ ...rootData, ...data }); // eslint-disable-line callback-return
                        } catch (error) {
                            console.log(error);

                            throw error;
                        } finally {
                            global.withTestTransaction = null;
                            // global.testTransaction = null;
                            await t1.rollback();
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

    async testUseCasePositive({ serviceClass: Service, input = {}, expected = {}, context = {} } = {}) {
        function serviceRunner() {
            const service = new Service({ context });

            return service.run(input);
        }

        return this._testUseCasePositiveAbstract({ serviceRunner, expected }, this.testContext);
    }

    async testUseCaseNegative({ serviceClass: Service, input = {}, exception = {}, context = {} } = {}) {
        function serviceRunner() {
            const service = new Service({ context });

            return service.run(input);
        }

        return this._testUseCaseNegativeAbstract({ serviceRunner, exception }, this.testContext);
    }

    async _testUseCasePositiveAbstract({ serviceRunner, expected = {} } = {}, assert) {
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
        delete got.status; // TODO: remove this dirty hack
        assert.deepEqual(got, validated);

        return got;
    }

    async _testUseCaseNegativeAbstract({ serviceRunner, exception = {} } = {}, assert) {
        const error = await assert.throwsAsync(
            serviceRunner,
            { instanceOf: Exception }
        );

        assert.deepEqual(error, new Exception(exception));
    }
}

export default Tester;

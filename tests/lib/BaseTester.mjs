import FileSystem     from 'fs';
import test           from 'ava';
import LIVR           from 'livr';
import extraRules     from 'livr-extra-rules';
import nodemailerMock from 'nodemailer-mock';
import stubTransport  from 'nodemailer-stub-transport';

import initAllModels  from '../../lib/domain-model/initModels.mjs';
import UseCaseBase    from '../../lib/use-cases/Base.mjs';
import EmailSender    from '../../lib/infrastructure/notificator/Mail.mjs';
import appConfig      from '../../lib/config.cjs';

import TestFactory    from './TestFactory.mjs';

const fs = FileSystem.promises;

// This function is needed to make linter alive for current file
// eslint-disable-next-line func-style
const lazyImport = (path) => import(path);

class BaseTester {
    constructor() {
        const { sequelize } = initAllModels(appConfig['test-db']);

        const notificator = new EmailSender({
            mailOptions : appConfig.mail,
            mainUrl     : appConfig.mainUrl
        });

        const transport = nodemailerMock.createTransport(stubTransport());

        notificator.setTransport(transport);

        UseCaseBase.setNotificatorInstanse(notificator);
        UseCaseBase.setSequelizeInstanse(sequelize); // TODO find a better way

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

                    await this.sequelize.transaction(async t1 => {
                        // To allow to run several ava files in concurrent mode.
                        await this.#lockDBExclusively();

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

    async testUseCasePositiveAbstract({ useCaseRunner, expected = {} } = {}, assert = this.testContext) {
        const got = await useCaseRunner();
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

    async testUseCaseNegativeAbstract({ useCaseRunner, exception = {} } = {}, assert = this.testContext) {
        const error = await useCaseRunner();

        assert.deepEqual(error, exception);
    }

    #lockDBExclusively = async () => {
        const { QueryTypes } = this.sequelize;
        // Ava runs multiple tests files the same time. But we have only one db.
        // We use this lock as mutex for database access
        // So, only one test will work with the database the same time.
        // We expect that this method is called at the beginning of a transaction.
        // If you will rollback DB in another way. Start transaction in this method and
        // rollback it in some unclockDB method

        await this.sequelize.query('SELECT * FROM `SequelizeMeta` FOR UPDATE', { type: QueryTypes.SELECT });
    }
}

export default BaseTester;

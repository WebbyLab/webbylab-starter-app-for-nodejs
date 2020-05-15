import path                 from 'path';
import fs                   from 'fs';
import lineReader           from 'line-reader';
import { promisify }        from '../../packages.mjs';

import { getDirName }       from '../../lib/utils/index.mjs';

import Base                 from './BaseGenerator.mjs';

import generateDataFixtures from './utils/generateDataFixtures.mjs';

const fsPromises = fs.promises;
const dirname = getDirName(import.meta.url);

lineReader.openAsync = promisify(lineReader.open);

async function lazyImport(pathToImport) {
    // eslint-disable-next-line no-param-reassign
    if (pathToImport[0] !== '.') pathToImport = `./${pathToImport}`;
    const importedModule = await import(pathToImport);

    return importedModule.default ? importedModule.default : importedModule;
}

class TestsGenerator extends Base {
    constructor({ model, config, logger }) {
        super({ model, config, logger });

        this.folders = {
            templates          : path.join(config.templatesFolder, 'tests'),
            testCasesTemplates : path.join(config.templatesFolder, 'tests/test-cases'),
            usecases           : path.join(config.usecasesFolder, config.namespace, this.modelNames.plural_lcc),
            models             : config.modelsFolder,
            root               : '',
            tests              : config.testsFolder,
            testsLib           : path.join(config.testsFolder, 'lib'),
            dataFixtures       : path.join(config.testsFolder, 'fixtures', 'data'),
            useCaseFixtures    : path.join(config.testsFolder, 'fixtures', 'use-cases', this.config.namespace),
            usecasesTestSuites : path.join(config.testsFolder, 'use-cases', this.config.namespace),
            restApiTestSuites  : path.join(config.testsFolder, 'api/rest-api', this.config.namespace),
            jsonRpcTestSuites  : path.join(config.testsFolder, 'api/json-rpc', this.config.namespace)
        };

        this.files = {
            model               : path.join(config.modelsFolder, `${this.modelNames.original}.mjs`),
            configTemplate      : path.join(this.folders.templates, 'fixtures', 'config'),
            testFactoryTemplate : path.join(this.folders.templates, 'fixtures', 'testFactory'),
            testFactory         : path.join(this.folders.testsLib, 'TestFactory.mjs'),
            useCaseTester       : path.join(this.folders.testsLib, 'UseCaseTester.mjs'),
            restApiTester       : path.join(this.folders.testsLib, 'RestAPITester.mjs'),
            jsonRpcTester       : path.join(this.folders.testsLib, 'JsonRPCTester.mjs'),
            dataFixtures        : path.join(this.folders.dataFixtures, `${this.modelNames.plural_lcc}.json`)
        };

        this.actionsMap = {
            'c' : 'create',
            'r' : 'show',
            'u' : 'update',
            'd' : 'delete',
            'l' : 'list'
        };
    }

    async generate(options, layers) {
        if (layers['test-fixtures']) {
            this.logger.header('Generate Fixtures');
            await this.#generateDataFixtures(options);
            await this.#generateTestFactorySetup();

            this.logger.header('Generate Fixtures: UseCases');
            await this.#generateUseCaseFixtures(options);
        }

        if (layers['test-use-cases']) {
            this.logger.header('Generate Test Suites: UseCases');
            await this.#generateUseCasesTestSuites(options);
        }

        if (layers['test-rest-api']) {
            this.logger.header('Generate Test Suites: RestAPI');
            await this.#generateRestApiTestSuites(options);
        }

        if (layers['test-json-rpc']) {
            this.logger.header('Generate Test Suites: JsonRPC');
            await this.#generateJsonRpcTestSuites(options);
        }
    }

    #generateDataFixtures = async ({ override } = {}) => {
        if (!override && this.fileExists(this.files.dataFixtures)) {
            this.logger.skipped(this.files.dataFixtures);
        } else {
            const data = generateDataFixtures(this.model.schema);

            await this.writeFile(this.files.dataFixtures, JSON.stringify(data, null, 4));
            this.logger.created(this.files.dataFixtures);
        }
    }

    #generateTestFactorySetup = async () => {
        const tmpTestFactoryPath = 'bin/generator/tmp/TestFactory.mjs';

        await this.writeFile(tmpTestFactoryPath, '');

        const reader = await lineReader.openAsync(path.join(process.cwd(), this.files.testFactory));

        reader.nextLineAsync = promisify(reader.nextLine);
        reader.closeAsync = promisify(reader.close);

        try {
            while (reader.hasNextLine()) {
                const line = await reader.nextLineAsync();

                if (line.includes(this.modelNames.original)) {
                    this.logger.skipped(this.files.testFactory);

                    return;
                } else if (line.includes('class TestFactory')) {
                    const testFactoryTemplate = await this.readFileString(this.files.testFactoryTemplate);
                    const templateString = this.fillTemplateWithData(testFactoryTemplate, {
                        'MODEL_NAME'                  : this.modelNames.original,
                        'MODEL_NAME_PLURAL'           : this.modelNames.plural,
                        'MODEL_NAME_PLURAL_toLC'      : this.modelNames.plural_lcc,
                        'RELATIVE_MODEL_PATH'         : path.relative(this.folders.testsLib, this.files.model),
                        'RELATIVE_DATA_FIXTURES_PATH' : path.relative(this.folders.testsLib, this.files.dataFixtures)
                    });
                    const lines = templateString.split(/\r?\n/);
                    const importLines = [];
                    const functionLines = [];

                    for (const templateLine of lines) {
                        if (templateLine.includes('import')) {
                            importLines.push(templateLine);
                        } else if (templateLine) {
                            functionLines.push(templateLine);
                        }
                    }

                    importLines.push('\n');
                    functionLines.push('\n');

                    await this.appendLines(tmpTestFactoryPath, importLines);
                    await this.writeFile(tmpTestFactoryPath, `${line}\n`, 'append');
                    await this.appendLines(tmpTestFactoryPath, functionLines);
                } else {
                    await this.writeFile(tmpTestFactoryPath, `${line}\n`, 'append');
                }
            }

            await fsPromises.copyFile(tmpTestFactoryPath, this.files.testFactory);
            this.fixEsLint(this.files.testFactory);
            this.logger.modified(this.files.testFactory);
        } finally {
            await reader.closeAsync();
        }
    }

    #generateUseCaseFixtures = async ({ override, actor, actions } = {}) => {
        if (!actor) throw new Error('"actor" is required to generate tests');
        const actorNameVariants = this.generateModelNameVariants(actor);
        const useCases = actions.split('').map(action => this.actionsMap[action]);

        const data = await lazyImport(path.relative(dirname, this.files.dataFixtures));

        for (const useCase of useCases) {
            const useCaseToUCC = useCase[0].toUpperCase() + useCase.slice(1, useCase.length);
            const useCaseName = `${this.modelNames.plural_lcc}-${useCase}`;
            const useCaseFile = path.join(this.folders.usecases, `${useCaseToUCC}.mjs`);
            const useCaseFixturesPath = path.join(this.folders.useCaseFixtures, useCaseName);

            if (!override && this.fileExists(useCaseFixturesPath)) {
                this.logger.skipped(useCaseFixturesPath);
                continue;
            }

            const configTemplate = await this.readFileString(this.files.configTemplate);
            const configString = this.fillTemplateWithData(configTemplate, {
                'MODEL_NAME_toLC'        : this.modelNames.lcc,
                'MODEL_NAME_PLURAL'      : this.modelNames.plural,
                'MODEL_NAME_PLURAL_toLC' : this.modelNames.plural_lc,
                'USE_CASE_NAME'          : `${this.modelNames.namespaced_plural}${useCaseToUCC}`,
                'USE_CASE_RELATIVE_PATH' : path.relative(path.join(useCaseFixturesPath, 'positive'), useCaseFile),
                'ACTOR_PLURAL_toLC'      : actorNameVariants.plural_lcc,
                'ACTOR_PLURAL'           : actorNameVariants.plural,
                'ACTOR_toLC'             : actorNameVariants.lcc
            });

            await this.#generateTestFixturesConfig(useCaseFixturesPath, 'positive', configString);
            await this.#generateTestFixturesConfig(useCaseFixturesPath, 'negative', configString);

            await this.#generateTestCases(useCase, 'positive', data);
            await this.#generateTestCases(useCase, 'negative', data);

            this.logger.created(useCaseFixturesPath);
        }
    }

    // type = positive || negative
    #generateTestFixturesConfig = async (fixturesFolder, type = '', configString) => {
        const folderPath = path.join(fixturesFolder, type);

        await this.createFolderIfNotExists(folderPath);
        const configPositivePath = path.join(folderPath, 'config.mjs');

        await this.writeFileAndFixEslint(configPositivePath, configString);
    }

    // type = positive || negative
    #generateTestCases = async (useCase, type = '', data = []) => {
        const useCaseName = `${this.modelNames.plural_lcc}-${useCase}`;
        const useCaseFixturesPath = path.join(this.folders.useCaseFixtures, useCaseName);
        const testCasesTemplatesFolder = path.join(this.folders.testCasesTemplates, useCase);

        if (!this.fileExists(path.join(testCasesTemplatesFolder, `${type}.mjs`))) return;
        const testCases = await lazyImport(path.relative(dirname, path.join(testCasesTemplatesFolder, `${type}.mjs`)));

        for (const [ testCase, fn ] of Object.entries(testCases)) {
            const testCaseFolder = path.join(useCaseFixturesPath, type, testCase);

            const files = fn(this.model.schema, data);

            if (Object.keys(files).length === 0) continue;

            await this.createFolderIfNotExists(testCaseFolder);

            for (const [ file, value ] of Object.entries(files)) {
                await this.writeFile(path.join(testCaseFolder, `${file}.json`), JSON.stringify(value, null, 4));
            }
        }
    }

    #generateUseCasesTestSuites = async ({ override, actions } = {}) => {
        const useCases = actions.split('').map(action => this.actionsMap[action]);

        for (const useCase of useCases) {
            const useCaseName = `${this.modelNames.plural_lcc}-${useCase}`;
            const useCaseFixturesPath = path.join(this.folders.useCaseFixtures, useCaseName);
            const useCaseTestSuitePath = path.join(this.folders.usecasesTestSuites, `${useCaseName}.test.mjs`);
            const testSuiteTemplatePath = path.join(this.folders.templates, 'use-cases', useCase);

            if (!override && this.fileExists(useCaseTestSuitePath)) {
                this.logger.skipped(useCaseTestSuitePath);
                continue;
            }

            const testSuiteTemplate = await this.readFileString(testSuiteTemplatePath);

            const suiteString = this.fillTemplateWithData(testSuiteTemplate, {
                'MODEL_NAME_toLC'        : this.modelNames.lcc,
                'NAMESPACED_MODEL_NAME'  : `${this.config.namespace}/${this.modelNames.plural_lcc}`,
                'ROOT_RELATIVE_PATH'     : path.relative(this.folders.usecasesTestSuites, process.cwd()),
                'TESTER_RELATIVE_PATH'   : path.relative(this.folders.usecasesTestSuites, this.files.useCaseTester),
                'FIXTURES_RELATIVE_PATH' : path.relative(this.folders.usecasesTestSuites, useCaseFixturesPath)
            });

            await this.writeFileAndFixEslint(useCaseTestSuitePath, suiteString);
            this.logger.created(useCaseTestSuitePath);
        }
    }

    #generateRestApiTestSuites = async ({ override, actor, actions } = {}) => {
        if (!actor) throw new Error('"actor" is required to generate tests');
        const actorNameVariants = this.generateModelNameVariants(actor);
        const useCases = actions.split('').map(action => this.actionsMap[action]);

        for (const useCase of useCases) {
            const useCaseName = `${this.modelNames.plural_lcc}-${useCase}`;
            const useCaseFixturesPath = path.join(this.folders.useCaseFixtures, useCaseName);
            const useCaseTestSuitePath = path.join(this.folders.restApiTestSuites, `${useCaseName}.test.mjs`);
            const testSuiteTemplatePath = path.join(this.folders.templates, 'rest-api', useCase);

            if (!override && this.fileExists(useCaseTestSuitePath)) {
                this.logger.skipped(useCaseTestSuitePath);
                continue;
            }

            const testSuiteTemplate = await this.readFileString(testSuiteTemplatePath);

            // TODO: discuss and remove 'main' check
            const namespacedModeelName = this.config.namespace === 'main'
                // eslint-disable-next-line more/no-duplicated-chains
                ? this.modelNames.plural_lcc
                // eslint-disable-next-line more/no-duplicated-chains
                : `${this.config.namespace}/${this.modelNames.plural_lcc}`;

            const suiteString = this.fillTemplateWithData(testSuiteTemplate, {
                'NAMESPACED_MODEL_NAME'  : namespacedModeelName,
                'MODEL_NAME_toLC'        : this.modelNames.lcc,
                'ACTOR_toLC'             : actorNameVariants.lcc,
                'ROOT_RELATIVE_PATH'     : path.relative(this.folders.restApiTestSuites, process.cwd()),
                'TESTER_RELATIVE_PATH'   : path.relative(this.folders.restApiTestSuites, this.files.restApiTester),
                'FIXTURES_RELATIVE_PATH' : path.relative(this.folders.restApiTestSuites, useCaseFixturesPath)
            });

            await this.writeFileAndFixEslint(useCaseTestSuitePath, suiteString);
            this.logger.created(useCaseTestSuitePath);
        }
    }

    #generateJsonRpcTestSuites = async ({ override, actions } = {}) => {
        const useCases = actions.split('').map(action => this.actionsMap[action]);

        for (const useCase of useCases) {
            const useCaseName = `${this.modelNames.plural_lcc}-${useCase}`;
            const useCaseFixturesPath = path.join(this.folders.useCaseFixtures, useCaseName);
            const useCaseTestSuitePath = path.join(this.folders.jsonRpcTestSuites, `${useCaseName}.test.mjs`);
            const testSuiteTemplatePath = path.join(this.folders.templates, 'json-rpc', useCase);

            if (!override && this.fileExists(useCaseTestSuitePath)) {
                this.logger.skipped(useCaseTestSuitePath);
                continue;
            }

            const testSuiteTemplate = await this.readFileString(testSuiteTemplatePath);

            const suiteString = this.fillTemplateWithData(testSuiteTemplate, {
                'MODEL_NAME_toLC'        : this.modelNames.lcc,
                'NAMESPACED_MODEL_NAME'  : `${this.config.namespace}/${this.modelNames.plural_lcc}`,
                'ROOT_RELATIVE_PATH'     : path.relative(this.folders.jsonRpcTestSuites, process.cwd()),
                'TESTER_RELATIVE_PATH'   : path.relative(this.folders.jsonRpcTestSuites, this.files.jsonRpcTester),
                'FIXTURES_RELATIVE_PATH' : path.relative(this.folders.jsonRpcTestSuites, useCaseFixturesPath)
            });

            await this.writeFileAndFixEslint(useCaseTestSuitePath, suiteString);
            this.logger.created(useCaseTestSuitePath);
        }
    }
}

export default TestsGenerator;

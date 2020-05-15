import path from 'path';
import Base from './BaseGenerator.mjs';

class RestAPIGenerator extends Base {
    constructor({ model, config, logger }) {
        super({ model, config, logger });

        this.folders = {
            templates   : path.join(config.templatesFolder, 'rest-api'),
            controllers : path.join(config.apiFolder, config.namespace, 'controllers'),
            usecases    : path.join(config.usecasesFolder, config.namespace, this.modelNames.plural_lcc),
            api         : path.join(config.apiFolder, config.namespace),
            apiBase     : config.apiFolder
        };

        this.files = {
            router                   : path.join(this.folders.api, 'router.mjs'),
            controller               : path.join(this.folders.controllers, `${this.modelNames.plural_lcc}.mjs`),
            controllersIndex         : path.join(this.folders.controllers, 'index.mjs'),
            controllersIndexTemplate : path.join(this.folders.templates, 'controllerIndex'),
            routerTemplate           : path.join(this.folders.templates, 'router'),
            routesTemplate           : path.join(this.folders.templates, 'routes')
        };
    }

    async generate(options, layers) {
        if (!layers['rest-api']) return;
        this.logger.header('Generate API');

        this.logger.log('Controllers:');
        await this.#generateController(options);
        await this.#generateControllerIndex(options);

        this.logger.log('\nRouter:');
        await this.#generateRouter(options);
    }

    #generateController = async ({ override, actions } = {}) => {
        await this.createFolderIfNotExists(this.folders.controllers);
        if (!override && this.fileExists(this.files.controller)) {
            this.logger.skipped(this.files.controller);
        } else {
            const controllerTemplate = this.#getContrrollerTemplate({ actions });

            const controllerFileString = this.fillTemplateWithData(controllerTemplate, {
                'MODEL_NAME_NAMESPACED'  : this.modelNames.namespaced_plural,
                // Paths
                'USECASES_RELATIVE_PATH' : path.relative(this.folders.controllers, this.folders.usecases),
                'API_RELATIVE_PATH'      : path.relative(this.folders.controllers, this.folders.apiBase)
            });

            await this.writeFileAndFixEslint(this.files.controller, controllerFileString);
            this.logger.created(this.files.controller);
        }
    }

    #getContrrollerTemplate = ({ actions : _actions }) => {
        const actionsMap = {
            'c' : 'Create',
            'r' : 'Show',
            'u' : 'Update',
            'd' : 'Delete',
            'l' : 'List'
        };
        const paramsBuilderMap = {
            'Create' : 'req => req.body',
            'Show'   : 'req  => ({ id: req.params.id })',
            'Update' : 'req  => ({ ...req.body, id: req.params.id })',
            'Delete' : 'req => ({ ...req.body, id: req.params.id })',
            'List'   : 'req => ({ ...req.query, ...req.params })'
        };

        const actions = _actions.split('').map(action => actionsMap[action]);

        let template = 'import chista from \'{{API_RELATIVE_PATH}}/chista.mjs\';\n\n';

        for (const action of actions) {
            template += `import {{MODEL_NAME_NAMESPACED}}${action} from '{{USECASES_RELATIVE_PATH}}/${action}.mjs';\n`;
        }

        template += '\nexport default {\n';

        for (const action of actions) {
            template += `${action.toLowerCase()} : chista.makeUseCaseRunner({{MODEL_NAME_NAMESPACED}}${action}, ${paramsBuilderMap[action]}),\n`;
        }

        template += '};\n';

        return template;
    }

    #generateControllerIndex = async () => {
        await this.copyFileIfNotExists(this.files.controllersIndex, this.files.controllersIndexTemplate);
        const controllersIndexString = await this.readFileString(this.files.controllersIndex);
        const modelName = this.modelNames.plural_lcc;

        if (controllersIndexString.includes(`'./${modelName}.mjs';`)) {
            this.logger.skipped(this.files.controllersIndex);
        } else {
            const lines = controllersIndexString.split(/\r?\n/);

            let fileString = `import ${modelName} from './${modelName}.mjs';\n`;

            for (const line of lines) {
                fileString += `${line}\n`;
                if (line.includes('export default')) {
                    fileString += `${modelName},\n`;
                }
            }

            fileString = fileString.trim();

            await this.writeFileAndFixEslint(this.files.controllersIndex, fileString);
            this.logger.modified(this.files.controllersIndex);
        }
    }

    #generateRouter = async ({ actions }) => {
        await this.copyFileIfNotExists(this.files.router, this.files.routerTemplate);
        const routerFileString = await this.readFileString(this.files.router);

        if (routerFileString.includes(`// ${this.modelNames.plural}`)) {
            this.logger.skipped(this.files.router);
        } else {
            const routesTemplateString = this.#getRoutesTemplate({ actions });
            const routerString = this.fillTemplateWithData(routesTemplateString, {
                'MODEL_NAME_PLURAL'       : this.modelNames.plural,
                'MODEL_NAME_PLURAL_toLCC' : this.modelNames.plural_lcc
            });

            await this.writeFileAndFixEslint(this.files.router, routerString, 'append');
            this.logger.modified(this.files.router);
        }
    }

    #getRoutesTemplate = ({ actions }) => {
        let template = '\n// {{MODEL_NAME_PLURAL}}\n';
        const actionsMap = {
            'c' : 'router.post(\'/{{MODEL_NAME_PLURAL_toLCC}}\',       checkSession, controllers.{{MODEL_NAME_PLURAL_toLCC}}.create);',
            'r' : 'router.get(\'/{{MODEL_NAME_PLURAL_toLCC}}/:id\',    checkSession, controllers.{{MODEL_NAME_PLURAL_toLCC}}.show);',
            'u' : 'router.put(\'/{{MODEL_NAME_PLURAL_toLCC}}/:id\',    checkSession, controllers.{{MODEL_NAME_PLURAL_toLCC}}.update);',
            'd' : 'router.delete(\'/{{MODEL_NAME_PLURAL_toLCC}}/:id\', checkSession, controllers.{{MODEL_NAME_PLURAL_toLCC}}.delete);',
            'l' : 'router.get(\'/{{MODEL_NAME_PLURAL_toLCC}}\',        checkSession, controllers.{{MODEL_NAME_PLURAL_toLCC}}.list);'
        };

        for (const action of actions) {
            template += `${actionsMap[action]}\n`;
        }

        return template;
    }
}

export default RestAPIGenerator;

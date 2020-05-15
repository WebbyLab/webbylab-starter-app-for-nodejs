import path from 'path';
import Base from './BaseGenerator.mjs';

class JsonRpcGenerator extends Base {
    constructor({ model, config, logger }) {
        super({ model, config, logger });

        this.folders = {
            templates   : path.join(config.templatesFolder, 'rest-api'),
            controllers : path.join(config.jsonRpcFolder, config.namespace),
            usecases    : path.join(config.usecasesFolder, config.namespace, this.modelNames.plural_lcc),
            api         : config.jsonRpcFolder
        };

        this.files = {
            controller       : path.join(this.folders.controllers, `${this.modelNames.plural_lcc}.mjs`),
            controllersIndex : path.join(this.folders.controllers, 'index.mjs')
        };
    }

    async generate(options, layers) {
        if (!layers['json-rpc']) return;
        this.logger.header('Generate JSON RPC');

        this.logger.log('Controllers:');
        await this.#generateController(options);
        await this.#generateControllerIndex(options);
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
                'API_RELATIVE_PATH'      : path.relative(this.folders.controllers, this.folders.api)
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

        const actions = _actions.split('').map(action => actionsMap[action]);

        let template = 'import chista from \'{{API_RELATIVE_PATH}}/chista.mjs\';\n\n';

        for (const action of actions) {
            template += `import {{MODEL_NAME_NAMESPACED}}${action} from '{{USECASES_RELATIVE_PATH}}/${action}.mjs';\n`;
        }

        template += '\nexport default {\n';

        for (const action of actions) {
            template += `{{MODEL_NAME_NAMESPACED}}${action} : chista.makeUseCaseRunner({{MODEL_NAME_NAMESPACED}}${action}),\n`;
        }

        template += '};\n';

        return template;
    }

    #generateControllerIndex = async () => {
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
                    fileString += `...${modelName},\n`;
                }
            }

            fileString = fileString.trim();

            await this.writeFileAndFixEslint(this.files.controllersIndex, fileString);
            this.logger.modified(this.files.controllersIndex);
        }
    }
}

export default JsonRpcGenerator;

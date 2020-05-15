import path                 from 'path';
import { DataTypes }        from '../../packages.mjs';

import generateDumpTemplate from './utils/generateDumpTemplate.mjs';
import generateLIVRRulesFromSchema from './utils/generateLIVRRulesFromSchema.mjs';

import Base from './BaseGenerator.mjs';

class UseCasesGenerator extends Base {
    constructor({ model, config, logger }) {
        super({ model, config, logger });

        this.folders = {
            templates : path.join(config.templatesFolder, 'use-cases'),
            usecases  : path.join(config.usecasesFolder, config.namespace, this.modelNames.plural_lcc),
            models    : config.modelsFolder
        };

        this.files = {
            packages     : 'packages.mjs',
            dumps        : config.dumpsFile,
            usecasesBase : path.join(config.usecasesFolder, 'Base.mjs'),
            model        : path.join(config.modelsFolder, `${this.modelNames.original}.mjs`),
            dmx          : path.join(config.modelsFolder, 'X.mjs')
        };
    }

    async generate(options, layers) {
        if (!layers['use-cases']) return;
        this.logger.header('Generate Dump:');
        await this.#generateDump(options);

        this.logger.header('Generate UseCases:');
        await this.#generateUseCases(options);
    }

    #generateDump = async () => {
        // Check if dump exists
        const dumpsFileString = await this.readFileString(this.files.dumps);

        if (dumpsFileString.includes(`dump${this.modelNames.original}`)) {
            this.logger.skipped(this.files.dumps);

            return;
        }

        // Create template and fill it
        const template = generateDumpTemplate({
            ...this.model.schema,
            createdAt : this.model.schema.createdAt || { type: DataTypes.DATE, allowNull: false },
            updatedAt : this.model.schema.updatedAt || { type: DataTypes.DATE, allowNull: false }
        });

        const fileString = this.fillTemplateWithData(template, {
            'MODEL_NAME'       : this.modelNames.original,
            'MODEL_NAME_tolCC' : this.modelNames.lcc
        });

        // Write file
        await this.writeFileAndFixEslint(this.files.dumps, fileString, 'append');
        this.logger.modified(this.files.dumps);
    }

    #generateUseCases = async ({ override, actions } = {}) => {
        const actionsMap = {
            'c' : 'Create',
            'r' : 'Show',
            'u' : 'Update',
            'd' : 'Delete',
            'l' : 'List'
        };
        const templatesList = actions.split('').map(action => actionsMap[action]);

        await this.createFolderIfNotExists(this.folders.usecases);

        for (const templateFile of templatesList) {
            const filePath = path.join(this.folders.usecases, `${templateFile}.mjs`);

            if (!override && this.fileExists(filePath)) {
                this.logger.skipped(filePath);
                continue;
            }

            const template = await this.readFileString(path.join(this.folders.templates, templateFile));

            // Fill template with data
            const fileString = this.fillTemplateWithData(template, {
                'MODEL_NAME'            : this.modelNames.original,
                'MODEL_NAME_tolCC'      : this.modelNames.lcc,
                'MODEL_NAME_PLURAL'     : this.modelNames.plural_lc,
                'MODEL_NAME_NAMESPACED' : this.modelNames.namespaced_plural,
                'LIVR_RULES'            : generateLIVRRulesFromSchema(this.model.schema),
                'LIVR_RULES_ID'         : this.#getLIVRRulesForID(this.model.schema),
                'SEARCH_FIELDS'         : this.#getStringTypeFieldNames(this.model.schema),

                // Paths
                'PACKAGES_RELATIVE_PATH'     : path.relative(this.folders.usecases, this.files.packages),
                'USECASE_BASE_RELATIVE_PATH' : path.relative(this.folders.usecases, this.files.usecasesBase),
                'DUMPS_RELATIVE_PATH'        : path.relative(this.folders.usecases, this.files.dumps),
                'MODEL_RELATIVE_PATH'        : path.relative(this.folders.usecases, this.files.model),
                'DMX_RELATIVE_PATH'          : path.relative(this.folders.usecases, this.files.dmx)
            });

            // Write file
            await this.writeFileAndFixEslint(filePath, fileString);
            this.logger.created(filePath);
        }
    }

    #getStringTypeFieldNames = (schema) => {
        return JSON.stringify(Object.entries(schema)
            .map(([ key, field ]) => {
                const typeKey = typeof field.type === 'function'
                    ? field.type.key
                    : field.type.constructor.key;

                if ([ 'STRING', 'TEXT' ].includes(typeKey)) return key;
            })
            .filter(fieldKey => !!fieldKey && ![ 'id', 'password', 'passwordHash', 'salt' ].includes(fieldKey)));
    }

    #getLIVRRulesForID = (schema) => {
        return generateLIVRRulesFromSchema({ id: schema.id }, [], 'all');
    }
}

export default UseCasesGenerator;

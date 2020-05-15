import path                     from 'path';
import lineReader               from 'line-reader';
import { promisify, DataTypes } from '../../packages.mjs';

import generateMigration        from './utils/generateMigration.mjs';

import Base                     from './BaseGenerator.mjs';

lineReader.openAsync = promisify(lineReader.open);

class MigrationsGenerator extends Base {
    constructor({ model, config, logger, modelPath }) {
        super({ model, config, logger });

        this.folders = {
            tmp        : 'bin/generator/tmp',
            migrations : config.migrationsFolder,
            templates  : path.join(config.templatesFolder, 'migrations')
        };

        this.files = {
            migrationTemplate : path.join(this.folders.templates, 'migration'),
            model             : modelPath
        };
    }

    async generate(options) {
        if (!options.migration) return;
        this.logger.header('Generate migration');
        await this.#generateMigrations();
    }

    #generateMigrations = async () => {
        const date = (new Date()).toISOString().split('.')[0].replace(/(-|:|T)/g, '');
        const migrationFileName =  `${date}-${this.modelNames.plural}.js`;
        const migrationPath = path.join(this.folders.migrations, migrationFileName);

        const migrationTemplate = await this.readFileString(this.files.migrationTemplate);
        const schemaString = await generateMigration({
            ...this.model.schema,
            createdAt : this.model.schema.createdAt || { type: DataTypes.DATE, allowNull: false },
            updatedAt : this.model.schema.updatedAt || { type: DataTypes.DATE, allowNull: false }
        });

        const migrationString = this.fillTemplateWithData(migrationTemplate, {
            'MODEL_NAME_PLURAL' : this.modelNames.plural,
            'SCHEMA'            : schemaString
        });

        await this.writeFileAndFixEslint(migrationPath, migrationString);
        this.logger.created(migrationPath);
    }
}

export default MigrationsGenerator;

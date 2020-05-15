import path     from 'path';
import fs       from 'fs';
import { exec } from 'child_process';

const fsPromises = fs.promises;

class BaseGenerator {
    constructor({ config, model, logger }) {
        this.config = config;
        this.logger = logger;
        this.model = model;
        this.modelNames = this.generateModelNameVariants(model.name, config.namespace);
    }

    generateModelNameVariants = (modelName, namespace = '') => {
        return {
            'original'   : modelName,
            'plural'     : `${modelName}s`,
            'plural_lc'  : `${modelName.toLowerCase()}s`,
            'lcc'        : modelName[0].toLowerCase() + modelName.slice(1), // lowerCamelCase
            'plural_lcc' : `${modelName[0].toLowerCase() + modelName.slice(1)  }s`, // lowerCamelCase
            // eslint-disable-next-line prefer-template
            'namespaced' : namespace
                .split('/')
                .map(name => name ? `${name[0].toUpperCase()}${name.slice(1)}` : '')
                .join('') + modelName,
            // eslint-disable-next-line prefer-template
            'namespaced_plural' : namespace
                .split('/')
                .map(name => name ? `${name[0].toUpperCase()}${name.slice(1)}` : '')
                .join('') + modelName + 's'
        };
    }

    fileExists(filePath) {
        const absolutePath = path.join(process.cwd(), filePath);

        // eslint-disable-next-line no-sync
        return fs.existsSync(absolutePath);
    }

    async readFileString(filePath) {
        const absolutePath = path.join(process.cwd(), filePath);

        const fileBuffer = await fsPromises.readFile(absolutePath);

        return fileBuffer.toString();
    }

    async writeFile(filePath, data, mode = 'write') {
        const absolutePath = path.join(process.cwd(), filePath);

        if (mode === 'append') {
            await fsPromises.appendFile(absolutePath, data);
        } else if (mode === 'write') {
            await fsPromises.writeFile(absolutePath, data);
        }
    }

    async fixEsLint(filePath) {
        const absolutePath = path.join(process.cwd(), filePath);

        exec(`npx eslint ${absolutePath} --fix`);
    }

    async writeFileAndFixEslint(filePath, data, mode) {
        await this.writeFile(filePath, data, mode);
        this.fixEsLint(filePath);
    }

    async appendLines(filePath, lines) {
        let line = lines.shift();

        while (lines.length !== 0) {
            await fsPromises.appendFile(filePath, `${line}\n`);
            line = lines.shift();
        }
    }

    async createFolderIfNotExists(folderPath) {
        const absolutePath = path.join(process.cwd(), folderPath);

        // eslint-disable-next-line no-sync
        if (!fs.existsSync(absolutePath)) {
            await fsPromises.mkdir(absolutePath, { recursive: true });
        }
    }

    async copyFileIfNotExists(targetFile, sourceFile) {
        const targetAbsolutePath = path.join(process.cwd(), targetFile);
        const sourceAbsolutePath = path.join(process.cwd(), sourceFile);

        // eslint-disable-next-line no-sync
        if (!fs.existsSync(targetAbsolutePath)) {
            await fsPromises.copyFile(sourceAbsolutePath, targetAbsolutePath);

            this.logger.created(targetFile);
        }
    }

    fillTemplateWithData(template, data = {}) {
        let result = template;

        for (const [ templateKey, fillData ] of Object.entries(data)) {
            const regExp = new RegExp(`{{${  templateKey  }}}`, 'g');

            result = result.replace(regExp, fillData);
        }

        return result;
    }
}

export default BaseGenerator;

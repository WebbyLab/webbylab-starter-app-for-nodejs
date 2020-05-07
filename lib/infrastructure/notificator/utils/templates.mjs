import pathModule     from 'path';
import fse            from 'fs-extra';
import Handlebars     from 'handlebars';
import { getDirName } from '../../../utils/index.mjs';

const dirname = getDirName(import.meta.url);

const TEMPLATES_BY_TYPE = {
    ACTIVATE_USER  : 'activateUser',
    RESET_PASSWORD : 'resetPassword',
    CONTACT        : 'contact'
};

const TEMPLATES_LIST = {};

export async function getTemplate(type) {
    const templateName = TEMPLATES_BY_TYPE[type];

    if (TEMPLATES_LIST[templateName]) {
        return TEMPLATES_LIST[templateName];
    }

    const templatesDir = pathModule.join(dirname, '/../../../../templates');
    const [ bodyTemplate, subjectTemplate ] = await Promise.all([
        fse.readFile(pathModule.join(templatesDir, templateName, 'body.html')),
        fse.readFile(pathModule.join(templatesDir, templateName, 'subject.html'))
    ]);

    const template = {
        body    : Handlebars.compile(bodyTemplate.toString()),
        subject : Handlebars.compile(subjectTemplate.toString())
    };

    // eslint-disable-next-line require-atomic-updates
    TEMPLATES_LIST[templateName] = template;

    return template;
}

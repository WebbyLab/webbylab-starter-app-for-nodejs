import pathModule            from 'path';
import fse                   from 'fs-extra';
import Handlebars            from 'handlebars';

const TEMPLATES_BY_TYPE = {
    CONFIRM_EMAIL  : 'confirmEmail',
    RESET_PASSWORD : 'resetPassword',
    CONTACT        : 'contact'
};

const TEMPLATES_LIST = {};

export async function getTemplate(type) {
    const templateName = TEMPLATES_BY_TYPE[type];

    if (TEMPLATES_LIST[templateName]) {
        return TEMPLATES_LIST[templateName];
    }

    const templatesDir = pathModule.join(__dirname, '/../../templates');
    const [ bodyTemplate, subjectTemplate ] = await Promise.all([
        fse.readFile(pathModule.join(templatesDir, templateName, 'body.html')),
        fse.readFile(pathModule.join(templatesDir, templateName, 'subject.html'))
    ]);

    const template = {
        body    : Handlebars.compile(bodyTemplate.toString()),
        subject : Handlebars.compile(subjectTemplate.toString())
    };

    TEMPLATES_LIST[templateName] = template;

    return template;
}

export default (
    schema,
    skip = [ 'password', 'passwordHash', 'salt' ]
) => {
    let dumpTemplateString = 'export function dump{{MODEL_NAME}}({{MODEL_NAME_tolCC}}) {\n';

    dumpTemplateString += 'const dump = {\n';

    for (const [ key, field ] of Object.entries(schema)) {
        if (skip.includes(key)) continue;

        const typeKey = typeof field.type === 'function'
            ? field.type.key
            : field.type.constructor.key;

        const dumpBuilder = {
            DATE     : (fieldKey) => (`{{MODEL_NAME_tolCC}}.${fieldKey}.toISOString()`),
            DATEONLY : (fieldKey) => (`{{MODEL_NAME_tolCC}}.${fieldKey}.toISOString()`),
            TIME     : (fieldKey) => (`{{MODEL_NAME_tolCC}}.${fieldKey}.toISOString()`)
        }[typeKey] || function ANY(fieldKey) {
            return `{{MODEL_NAME_tolCC}}.${fieldKey}`;
        };

        dumpTemplateString += `${key} : ${dumpBuilder(key)},\n`;
    }

    dumpTemplateString += '};\n\n';
    dumpTemplateString += 'return dump;\n';
    dumpTemplateString += '}\n';

    return dumpTemplateString;
};

import generateLIVRRulesFromSchema from '../../../../utils/generateLIVRRulesFromSchema.mjs';

export default {
    '01-simple' : (schema, data) => {
        const object = data[0];
        const livrRules = {
            ...generateLIVRRulesFromSchema(schema, [], 'all', 'object'),
            'createdAt' : { 'iso_date': { 'min': 'current', 'format': 'datetime' } },
            'updatedAt' : { 'iso_date': { 'min': 'current', 'format': 'datetime' } }
        };

        for (const [ key, value ] of Object.entries(object)) {
            livrRules[key] = { 'is': value };
        }

        return {
            input    : {},
            expected : {
                data : [ 'required', { 'nested_object': livrRules } ]
            }
        };
    }
};

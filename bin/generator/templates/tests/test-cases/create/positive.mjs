import generateLIVRRulesFromSchema from '../../../../utils/generateLIVRRulesFromSchema.mjs';
import generateDataFixtures   from '../../../../utils/generateDataFixtures.mjs';

export default {
    '01-simple' : (schema) => {
        const object = generateDataFixtures(schema, 1)[0];
        const livrRules = {
            ...generateLIVRRulesFromSchema(schema, [], 'all', 'object'),
            'createdAt' : { 'iso_date': { 'min': 'current', 'format': 'datetime' } },
            'updatedAt' : { 'iso_date': { 'min': 'current', 'format': 'datetime' } }
        };

        for (const [ key, value ] of Object.entries(object)) {
            livrRules[key] = { 'is': value };
        }

        return {
            input : {
                data : object
            },
            expected : {
                data : [ 'required', { 'nested_object': livrRules } ]
            }
        };
    }
};

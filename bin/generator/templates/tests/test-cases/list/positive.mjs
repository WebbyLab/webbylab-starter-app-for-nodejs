import generateLIVRRulesFromSchema from '../../../../utils/generateLIVRRulesFromSchema.mjs';

export default {
    '01-simple' : (schema, data) => {
        const livrRules = {
            ...generateLIVRRulesFromSchema(schema, [], 'notNull', 'object'),
            'createdAt' : { 'iso_date': { 'min': 'current', 'format': 'datetime' } },
            'updatedAt' : { 'iso_date': { 'min': 'current', 'format': 'datetime' } }
        };

        return {
            input    : {},
            expected : {
                data : [ 'required', { 'list_of_objects': livrRules } ],
                meta : [ 'required', { 'nested_object' : {
                    totalCount    : { is: data.length },
                    filteredCount : { is: data.length },
                    limit         : { is: 20 },
                    offset        : { is: 0 }
                } } ]
            }
        };
    }
};

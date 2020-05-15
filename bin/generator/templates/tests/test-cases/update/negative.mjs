import generateDataFixtures   from '../../../../utils/generateDataFixtures.mjs';

export default {
    '01-wrong-id' : (schema) => {
        return {
            input : {
                id : generateDataFixtures({ id: schema.id }, 1, [])[0].id
            },
            exception : {
                'code'   : 'WRONG_ID',
                'fields' : {
                    'id' : 'WRONG_ID'
                }
            }
        };
    },
    '02-not-unique-field' : (schema, data) => {
        let uniqueFieldKey = '';

        for (const [ key, field ] of Object.entries(schema)) {
            if (field.unique === true) {
                uniqueFieldKey = key;
                break;
            }
        }

        if (!uniqueFieldKey) return {};

        const object = {
            ...generateDataFixtures(schema, 1)[0],
            [uniqueFieldKey] : data[1][uniqueFieldKey]
        };

        return {
            input : {
                data : object
            },
            exception : {
                'code'   : 'NOT_UNIQUE',
                'fields' : {
                    [uniqueFieldKey] : 'NOT_UNIQUE'
                }
            }

        };
    }
};

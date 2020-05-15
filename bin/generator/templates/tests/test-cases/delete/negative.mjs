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
    }
};

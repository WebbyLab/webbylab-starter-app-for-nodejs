import ServiceBase  from 'chista/ServiceBase';
import X            from 'chista/Exception';

import { dumpUser } from '../../utils/dumps.js';
import { User }     from '../../models.js';

export default class UsersUpdate extends ServiceBase {
    static validationRules = {
        id   : [ 'required', 'uuid' ],
        data : { 'nested_object' : {
            firstName  : [ { 'min_length': 2 }, { 'max_length': 50 } ],
            secondName : [ { 'min_length': 2 }, { 'max_length': 50 } ],
            lang       : { 'one_of': [ 'en', 'ru', 'ua' ] }
        } }
    };

    async execute({ id, data }) {
        const { firstName, secondName, lang } = data;
        const { userId, userRole } = this.context;

        if (id !== userId && userRole !== 'ADMIN') {
            throw new X({
                code   : 'PERMISSION_DENIED',
                fields : { token: 'WRONG_TOKEN' }
            });
        }

        const user = await User.findByPk(id);

        const result = await user.update({
            firstName,
            secondName,
            lang,
            updatedBy : userId
        });

        return {
            data : dumpUser(result)
        };
    }
}

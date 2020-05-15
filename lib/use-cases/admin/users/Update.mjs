import {
    Exception as X
} from '../../../../packages.mjs';
import Base         from '../../Base.mjs';
import { dumpUser } from '../../utils/dumps.mjs';
import User         from '../../../domain-model/User.mjs';
import DMX          from '../../../domain-model/X.mjs';

export default class AdminUsersUpdate extends Base {
    static validationRules = {
        id   : [ 'required', 'uuid' ],
        data : { 'nested_object' : {
            firstName  : [ { 'min_length': 2 }, { 'max_length': 50 } ],
            secondName : [ { 'min_length': 2 }, { 'max_length': 50 } ],
            avatar     : [ { 'min_length': 2 }, { 'max_length': 150 } ],
            lang       : { 'one_of': [ 'en', 'ru', 'ua' ] },
            status     : { 'one_of': [ 'ACTIVE', 'BLOCKED', 'PENDING' ] }
        } }
    };

    async execute({ id, data = {} }) {
        try {
            const { firstName, secondName, lang, avatar } = data;

            const user = await User.findById(id, { allowBlocked: 1, allowPending: 1 });

            const result = await user.update({
                firstName,
                secondName,
                lang,
                avatar
            });

            return {
                data : dumpUser(result)
            };
        } catch (x) {
            if (x instanceof DMX.WrongId) {
                throw new X({
                    code   : 'WRONG_ID',
                    fields : { [x.field]: 'WRONG_ID' }
                });
            }

            throw x;
        }
    }
}

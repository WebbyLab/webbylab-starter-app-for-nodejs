import {
    Exception as X
} from '../../../../packages.mjs';

import Base         from '../../Base.mjs';
import { dumpUser } from '../../utils/dumps.mjs';
import User         from '../../../domain-model/User.mjs';
import DMX          from '../../../domain-model/X.mjs';

export default class UsersUpdate extends Base {
    static validationRules = {
        id   : [ 'required', 'uuid' ],
        data : { 'nested_object' : {
            firstName  : [ { 'min_length': 2 }, { 'max_length': 50 } ],
            secondName : [ { 'min_length': 2 }, { 'max_length': 50 } ],
            avatar     : [ { 'min_length': 2 }, { 'max_length': 150 } ],
            lang       : { 'one_of': [ 'en', 'ru', 'ua' ] }
        } }
    };

    async execute({ id, data }) {
        try {
            const { firstName, secondName, lang, avatar } = data;
            const { userId } = this.context;

            if (id !== userId) {
                throw new X({
                    code   : 'PERMISSION_DENIED',
                    fields : { token: 'WRONG_TOKEN' }
                });
            }

            const user = await User.findById(id);

            const result = await user.update({
                firstName,
                secondName,
                lang,
                avatar
            });

            return { data: dumpUser(result) };
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

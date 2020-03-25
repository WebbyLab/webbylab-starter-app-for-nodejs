import {
    Exception as X
} from '../../../packages.mjs';

import Base  from '../Base.mjs';
import { dumpUser } from '../../utils/dumps.mjs';
import User         from '../../models/User.mjs';

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
        const { firstName, secondName, lang, avatar } = data;
        const { userId } = this.context;

        if (id !== userId) {
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
            avatar
        });

        return {
            data : dumpUser(result)
        };
    }
}

import ServiceBase  from '../../ServiceBase.js';
import { dumpUser } from '../../../utils/dumps.js';
import User         from '../../../models/User.js';

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

        const user = await User.findByPk(id);

        const result = await user.update({
            firstName,
            secondName,
            lang
        });

        return {
            data : dumpUser(result)
        };
    }
}

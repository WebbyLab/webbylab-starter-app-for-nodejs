import ServiceBase      from 'chista/ServiceBase';
import X                from 'chista/Exception';
import { dumpUser }     from '../../utils/dumps.js';
import emailSender      from '../emailSender';
import { User, Action } from '../../models.js';

export default class UsersCreate extends ServiceBase {
    static validationRules = {
        data : [ 'required', { 'nested_object' : {
            email           : [ 'required', 'email', 'to_lc' ],
            password        : [ 'required', 'string' ],
            confirmPassword : [ 'required', { 'equal_to_field': [ 'password' ] } ],
            role            : [ 'required', { 'one_of': [ 'USER' ] } ],
            lang            : [ 'string' ],
            agreeWithTerms  : [ 'required', { 'is': true } ]
        } } ]
    };

    async execute({ data }) {
        const isUserExist = await User.findOne({ where: { email: data.email } });

        if (isUserExist) {
            throw new X({
                code   : 'NOT_UNIQUE',
                fields : { email: 'NOT_UNIQUE' }
            });
        }
        const user = await User.create(data);

        const actionData = {
            type : 'CONFIRM_EMAIL',
            data : {
                userId : user.id,
                email  : user.email
            }
        };
        const action = await Action.create(actionData);

        await emailSender.send('CONFIRM_EMAIL', data.email, {
            ...user,
            actionId : action.id
        });

        return { data: dumpUser(user) };
    }
}

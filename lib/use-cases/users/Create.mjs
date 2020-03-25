import {
    Exception as X
} from '../../../packages.mjs';

import Base         from '../Base.mjs';
import { dumpUser } from '../../utils/dumps.mjs';
import emailSender  from '../../infrastructure/emailSender.mjs';
import Action       from '../../domain-model/Action.mjs';
import User         from '../../domain-model/User.mjs';

export default class UsersCreate extends Base {
    static validationRules = {
        data : [ 'required', { 'nested_object' : {
            email           : [ 'required', 'email', 'to_lc' ],
            password        : [ 'required', 'string' ],
            confirmPassword : [ 'required', { 'equal_to_field': [ 'password' ] } ],
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
            type : 'ACTIVATE_USER',
            data : {
                userId : user.id,
                email  : user.email
            }
        };
        const action = await Action.create(actionData);

        await emailSender.send('ACTIVATE_USER', data.email, {
            ...user,
            actionId : action.id
        });

        return { data: dumpUser(user) };
    }
}

import {
    Exception as X
} from '../../../../packages.js';

import ServiceBase  from '../../ServiceBase.js';
import { dumpUser } from '../../../utils/dumps.js';
import emailSender  from '../../emailSender.js';
import Action       from '../../../models/Action.js';
import User         from '../../../models/User.js';

const DEFAULT_PASSWORD = 'password';

export default class UsersCreate extends ServiceBase {
    static validationRules = {
        data : [ 'required', { 'nested_object' : {
            email : [ 'required', 'email', 'to_lc' ]
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
        const user = await User.create({
            password       : DEFAULT_PASSWORD,
            agreeWithTerms : true,
            ...data
        });

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

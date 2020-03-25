import {
    Exception as X
} from '../../../packages.mjs';
import ServiceBase from '../ServiceBase.mjs';
import emailSender from '../emailSender.mjs';
import Action      from '../../models/Action.mjs';
import User        from '../../models/User.mjs';

export default class UsersResetPassword extends ServiceBase {
    static validationRules = {
        data : { 'nested_object' : {
            email : [ 'required', 'email' ]
        } }
    };

    async execute({ data }) {
        const user = await User.findOne({ where: { email: data.email } });

        if (!user) {
            throw new X({
                code   : 'USER_NOT_FOUND',
                fields : { email: 'USER_NOT_FOUND' }
            });
        }

        if (user.status === 'BLOCKED') {
            throw new X({
                code   : 'USER_IS_BLOCKED',
                fields : { email: 'USER_IS_BLOCKED' }
            });
        }

        const actionData = {
            type : 'RESET_USER_PASSWORD',
            data : {
                userId : user.id,
                email  : user.email
            }
        };

        const action = await Action.create(actionData);

        await emailSender.send('RESET_PASSWORD', user.email, {
            ...user,
            actionId : action.id
        });

        return {};
    }
}

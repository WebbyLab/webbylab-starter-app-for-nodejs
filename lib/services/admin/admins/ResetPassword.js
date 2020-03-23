import {
    Exception as X
} from '../../../../packages.js';
import ServiceBase from '../../ServiceBase.js';
import emailSender from '../../emailSender.js';
import Action      from '../../../models/Action.js';
import Admin        from '../../../models/Admin.js';

export default class UsersResetPassword extends ServiceBase {
    static validationRules = {
        data : { 'nested_object' : {
            login : [ 'required', 'string', 'to_lc' ],
            email : [ 'required', 'email' ]
        } }
    };

    async execute({ data }) {
        const admin = await Admin.findOne({ where: { login: data.login } });

        if (!admin) {
            throw new X({
                code   : 'USER_NOT_FOUND',
                fields : { email: 'USER_NOT_FOUND' }
            });
        }

        const actionData = {
            type : 'RESET_ADMIN_PASSWORD',
            data : {
                adminId : admin.id,
                login   : admin.login
            }
        };

        const action = await Action.create(actionData);

        await emailSender.send('RESET_PASSWORD', data.email, {
            ...admin,
            actionId : action.id
        });

        return {};
    }
}

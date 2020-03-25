import {
    Exception as X
} from '../../../../packages.mjs';
import Base from '../../Base.mjs';
import emailSender from '../../emailSender.mjs';
import Action      from '../../../domain-model/Action.mjs';
import Admin        from '../../../domain-model/Admin.mjs';

export default class UsersResetPassword extends Base {
    static validationRules = {
        id : [ 'required', 'uuid' ]
    };

    async execute({ id }) {
        const admin = await Admin.findById(id);

        if (!admin) {
            throw new X({
                code   : 'USER_NOT_FOUND',
                fields : { id: 'USER_NOT_FOUND' }
            });
        }

        const actionData = {
            type : 'RESET_ADMIN_PASSWORD',
            data : {
                adminId : admin.id,
                email   : admin.email
            }
        };

        const action = await Action.create(actionData);

        await emailSender.send('RESET_PASSWORD', admin.email, {
            ...admin,
            actionId : action.id
        });

        return {};
    }
}

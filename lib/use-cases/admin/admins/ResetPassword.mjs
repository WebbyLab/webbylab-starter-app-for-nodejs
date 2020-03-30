import Base        from '../../Base.mjs';
import emailSender from '../../../infrastructure/emailSender.mjs';
import Action      from '../../../domain-model/Action.mjs';
import Admin       from '../../../domain-model/Admin.mjs';

export default class AdminsResetPassword extends Base {
    static validationRules = {
        id : [ 'required', 'uuid' ]
    };

    async execute({ id }) {
        const admin = await Admin.findById(id);

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

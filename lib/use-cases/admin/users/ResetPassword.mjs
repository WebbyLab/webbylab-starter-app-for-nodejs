import {
    Exception as X
} from '../../../../packages.mjs';
import Base        from '../../Base.mjs';
import emailSender from '../../../infrastructure/emailSender.mjs';
import Action      from '../../../domain-model/Action.mjs';
import User        from '../../../domain-model/User.mjs';
import DMX         from '../../../domain-model/X.mjs';

export default class UsersResetPassword extends Base {
    static validationRules = {
        id : [ 'required', 'uuid' ]
    };

    async execute({ id }) {
        try {
            const user = await User.findById(id);

            if (user.status === 'BLOCKED') {
                throw new X({
                    code   : 'USER_IS_BLOCKED',
                    fields : { id: 'USER_IS_BLOCKED' }
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
        } catch (x) {
            if (x instanceof DMX.WrongId) {
                throw new X({
                    code   : 'WRONG_ID',
                    fields : { [x.field]: 'WRONG_ID' }
                });
                /* c8 ignore next */
            }
            /* c8 ignore next 2 */
            throw x;
        }
    }
}

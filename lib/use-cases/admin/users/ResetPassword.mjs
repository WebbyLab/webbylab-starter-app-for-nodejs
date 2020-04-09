import {
    Exception as X
} from '../../../../packages.mjs';
import Base        from '../../Base.mjs';
import emailSender from '../../../infrastructure/emailSender.mjs';
import User        from '../../../domain-model/User.mjs';
import DMX         from '../../../domain-model/X.mjs';
import StoredTriggerableAction, { TYPES as ActionTypes } from '../../../domain-model/StoredTriggerableAction.mjs';

export default class AdminUsersResetPassword extends Base {
    static validationRules = {
        id : [ 'required', 'uuid' ]
    };

    async execute({ id }) {
        try {
            const action = await StoredTriggerableAction.create({
                type    : ActionTypes.ACTIVATE_USER,
                payload : { userId: id }
            });

            const user = await User.findById(id, { allowPending: 1 });

            await emailSender.send('RESET_PASSWORD', user.email, {
                ...user,
                actionId : action.id
            });

            return {};
        } catch (x) {
            if (x instanceof DMX.WrongId) {
                throw new X({
                    code   : 'USER_NOT_FOUND',
                    fields : { id: 'USER_NOT_FOUND' }
                });
                /* c8 ignore next */
            }
            if (x instanceof DMX.InactiveObject) {
                throw new X({
                    code   : 'USER_IS_BLOCKED',
                    fields : { id: 'USER_IS_BLOCKED' }
                });
                /* c8 ignore next */
            }
            /* c8 ignore next 2 */
            throw x;
        }
    }
}

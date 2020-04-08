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
            const user = await User.findById(id);

            const actionData = {
                type   : ActionTypes.RESET_USER_PASSWORD,
                object : user
            };

            const action = await StoredTriggerableAction.create(actionData);

            await emailSender.send('RESET_PASSWORD', user.email, {
                ...user,
                actionId : action.id
            });

            return {};
        } catch (x) {
            this.logger.error({
                useCase : 'AdminUsersResetPassword',
                error   : x
            });
            if (x instanceof DMX.WrongId || x instanceof DMX.EmptyObject) {
                throw new X({
                    code   : 'USER_NOT_FOUND',
                    fields : { id: 'USER_NOT_FOUND' }
                });
                /* c8 ignore next */
            }
            if (x instanceof DMX.ObjectBlocked) {
                throw new X({
                    code   : `${x.field}_IS_BLOCKED`,
                    fields : { id: `${x.field}_IS_BLOCKED` }
                });
                /* c8 ignore next */
            }
            /* c8 ignore next 2 */
            throw x;
        }
    }
}

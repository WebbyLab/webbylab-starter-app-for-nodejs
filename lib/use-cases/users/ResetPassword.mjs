import {
    Exception as X
} from '../../../packages.mjs';
import Base        from '../Base.mjs';
import emailSender from '../../infrastructure/emailSender.mjs';
import User        from '../../domain-model/User.mjs';
import DMX         from '../../domain-model/X.mjs';
import StoredTriggerableAction, { TYPES as ActionTypes } from '../../domain-model/StoredTriggerableAction.mjs';

export default class UsersResetPassword extends Base {
    static validationRules = {
        data : { 'nested_object' : {
            email : [ 'required', 'email' ]
        } }
    };

    async execute({ data }) {
        try {
            const user = await User.findOne({ where: { email: data.email } });

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
                useCase : 'UsersResetPassword',
                error   : x
            });
            if (x instanceof DMX.EmptyObject) {
                throw new X({
                    code   : `${x.field}_NOT_FOUND`,
                    fields : { email: `${x.field}_NOT_FOUND` }
                });
                /* c8 ignore next */
            }
            if (x instanceof DMX.ObjectBlocked) {
                throw new X({
                    code   : `${x.field}_IS_BLOCKED`,
                    fields : { email: `${x.field}_IS_BLOCKED` }
                });
                /* c8 ignore next */
            }
            /* c8 ignore next 2 */
            throw x;
        }
    }
}

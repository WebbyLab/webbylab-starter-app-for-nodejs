import {
    Exception as X
} from '../../../../packages.mjs';

import Base        from '../../Base.mjs';
import emailSender from '../../../infrastructure/emailSender.mjs';
import Admin       from '../../../domain-model/Admin.mjs';
import DMX         from '../../../domain-model/X.mjs';
import StoredTriggerableAction, { TYPES as ActionTypes } from '../../../domain-model/StoredTriggerableAction.mjs';

export default class AdminsResetPassword extends Base {
    static validationRules = {
        id : [ 'required', 'uuid' ]
    };

    async execute({ id }) {
        try {
            const admin = await Admin.findById(id);

            const actionData = {
                type   : ActionTypes.RESET_ADMIN_PASSWORD,
                object : admin
            };

            const action = await StoredTriggerableAction.create(actionData);

            await emailSender.send('RESET_PASSWORD', admin.email, {
                ...admin,
                actionId : action.id
            });

            return {};
        } catch (x) {
            this.logger.error({
                useCase : 'AdminsResetPassword',
                error   : x
            });
            if (x instanceof DMX.WrongId || x instanceof DMX.EmptyObject) {
                throw new X({
                    code   : 'WRONG_ID',
                    fields : { id: 'WRONG_ID' }
                });
                /* c8 ignore next */
            }
            /* c8 ignore next 2 */
            throw x;
        }
    }
}

import {
    Exception as X
} from '../../../../packages.mjs';

import Base  from '../../Base.mjs';
import Admin from '../../../domain-model/Admin.mjs';
import DMX   from '../../../domain-model/X.mjs';
import StoredTriggerableAction, { TYPES as ActionTypes } from '../../../domain-model/StoredTriggerableAction.mjs';

export default class AdminsResetPassword extends Base {
    static validationRules = {
        id : [ 'required', 'uuid' ]
    };

    async execute({ id }) {
        try {
            const action = await StoredTriggerableAction.create({
                type    : ActionTypes.RESET_ADMIN_PASSWORD,
                payload : { adminId: id }
            });

            const admin = await Admin.findById(id);

            await this.notificator.notify('RESET_PASSWORD', admin.email, {
                ...admin,
                actionId : action.id
            });

            return {};
        } catch (x) {
            if (x instanceof DMX.WrongId) {
                throw new X({
                    code   : 'WRONG_ID',
                    fields : { id: 'WRONG_ID' }
                });
            }

            throw x;
        }
    }
}

import {
    Exception as X
} from '../../../../packages.mjs';

import Base   from '../../Base.mjs';
import Action from '../../../domain-model/StoredTriggerableAction.mjs';
import User   from '../../../domain-model/User.mjs';
import DMX    from '../../../domain-model/X.mjs';

export default class UsersDelete extends Base {
    static validationRules = {
        id : [ 'required', 'uuid' ]
    };

    async execute({ id }) {
        try {
            const { userId } = this.context;

            if (id !== userId) {
                throw new X({
                    code   : 'PERMISSION_DENIED',
                    fields : { token: 'WRONG_TOKEN' }
                });
            }

            const user = await User.findById(id);

            await user.destroy();

            await Action.destroy({ where: { payload: { '"userId"': id } } });

            return { };
        } catch (x) {
            if (x instanceof DMX.WrongId) {
                throw new X({
                    code   : 'WRONG_ID',
                    fields : { [x.field]: 'WRONG_ID' }
                });
            }

            throw x;
        }
    }
}

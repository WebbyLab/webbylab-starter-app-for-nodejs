import {
    Exception as X
} from '../../../../packages.mjs';
import Base   from '../../Base.mjs';
import User   from '../../../domain-model/User.mjs';
import Action from '../../../domain-model/Action.mjs';
import DMX    from '../../../domain-model/X.mjs';

export default class AdminUsersDelete extends Base {
    static validationRules = {
        id : [ 'required', 'uuid' ]
    };

    async execute({ id }) {
        try {
            const user = await User.findById(id);

            await user.destroy();
            await Action.destroy({ where: { data: { '"userId"': id } } });

            return { };
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

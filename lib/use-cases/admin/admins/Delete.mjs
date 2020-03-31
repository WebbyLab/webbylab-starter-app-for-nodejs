import {
    Exception as X
} from '../../../../packages.mjs';
import Base   from '../../Base.mjs';
import Admin  from '../../../domain-model/Admin.mjs';
import Action from '../../../domain-model/Action.mjs';
import DMX    from '../../../domain-model/X.mjs';

export default class AdminsDelete extends Base {
    static validationRules = {
        id : [ 'required', 'uuid' ]
    };

    async execute({ id }) {
        try {
            const admin = await Admin.findById(id);

            await admin.destroy();
            await Action.destroy({ where: { data: { '"adminId"': id } } });

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

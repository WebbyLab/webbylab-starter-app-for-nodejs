import {
    Exception as X
} from '../../../../packages.mjs';
import Base   from '../../Base.mjs';
import Admin  from '../../../domain-model/Admin.mjs';
import DMX    from '../../../domain-model/X.mjs';
import { dumpAdmin } from '../../../utils/dumps.mjs';

export default class AdminsShow extends Base {
    static validationRules = {
        id : [ 'required', 'uuid' ]
    };

    async execute({ id }) {
        try {
            const admin = await Admin.findById(id);

            return { data: dumpAdmin(admin) };
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

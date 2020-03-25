import Base   from '../../Base.mjs';
import { dumpAdmin } from '../../../utils/dumps.mjs';
import Admin         from '../../../models/Admin.mjs';

export default class UsersShow extends Base {
    static validationRules = {
        id : [ 'required', 'uuid' ]
    };

    async execute({ id }) {
        const admin = await Admin.findById(id);

        return { data: dumpAdmin(admin) };
    }
}

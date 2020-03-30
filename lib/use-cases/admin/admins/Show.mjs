import Base          from '../../Base.mjs';
import { dumpAdmin } from '../../../utils/dumps.mjs';
import Admin         from '../../../domain-model/Admin.mjs';

export default class AdminsShow extends Base {
    static validationRules = {
        id : [ 'required', 'uuid' ]
    };

    async execute({ id }) {
        const admin = await Admin.findById(id);

        return { data: dumpAdmin(admin) };
    }
}

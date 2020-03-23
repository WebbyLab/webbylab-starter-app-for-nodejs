import ServiceBase   from '../../ServiceBase.js';
import { dumpAdmin } from '../../../utils/dumps.js';
import Admin         from '../../../models/Admin.js';

export default class UsersShow extends ServiceBase {
    static validationRules = {
        id : [ 'required', 'uuid' ]
    };

    async execute({ id }) {
        const admin = await Admin.findById(id);

        return { data: dumpAdmin(admin) };
    }
}

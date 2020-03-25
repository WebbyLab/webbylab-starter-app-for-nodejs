import ServiceBase from '../../ServiceBase.mjs';
import Admin       from '../../../models/Admin.mjs';

export default class UsersDelete extends ServiceBase {
    static validationRules = {
        id : [ 'required', 'uuid' ]
    };

    async execute({ id }) {
        const admin = await Admin.findById(id);

        await admin.destroy();

        return { };
    }
}

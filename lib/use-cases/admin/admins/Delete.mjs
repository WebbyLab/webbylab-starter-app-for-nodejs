import Base from '../../Base.mjs';
import Admin       from '../../../domain-model/Admin.mjs';

export default class UsersDelete extends Base {
    static validationRules = {
        id : [ 'required', 'uuid' ]
    };

    async execute({ id }) {
        const admin = await Admin.findById(id);

        await admin.destroy();

        return { };
    }
}

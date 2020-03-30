import Base   from '../../Base.mjs';
import Admin  from '../../../domain-model/Admin.mjs';
import Action from '../../../domain-model/Action.mjs';

export default class AdminsDelete extends Base {
    static validationRules = {
        id : [ 'required', 'uuid' ]
    };

    async execute({ id }) {
        const admin = await Admin.findById(id);

        await admin.destroy();
        await Action.destroy({ where: { data: { '"adminId"': id } } });

        return { };
    }
}

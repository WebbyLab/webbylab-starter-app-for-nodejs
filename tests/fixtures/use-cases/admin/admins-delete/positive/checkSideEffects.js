import Action from '../../../../../../lib/domain-model/StoredTriggerableAction.mjs';
import Admin  from '../../../../../../lib/domain-model/Admin.mjs';

export default async function checkSideEffects({ adminId }) {
    const admins = await Admin.findAll({ where: { id: adminId } });

    if (admins.length > 0) {
        throw new Error('Admin hasn\'t been deleted from database');
    }

    const actions = await Action.findAll({ where: { payload: { '"adminId"': adminId } } });

    if (actions.length > 0) {
        throw new Error('All related actions should be deleted on Admin Delete');
    }
}

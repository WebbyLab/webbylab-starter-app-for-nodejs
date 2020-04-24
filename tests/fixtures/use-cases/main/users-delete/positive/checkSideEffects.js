import Action     from '../../../../../../lib/domain-model/StoredTriggerableAction.mjs';
import User       from '../../../../../../lib/domain-model/User.mjs';

export default async function checkSideEffects({ userId }) {
    const users = await User.findAll({ where: { id: userId } });

    if (users.length > 0) {
        throw new Error('User hasn\'t been deleted from database');
    }

    const actions = await Action.findAll({ where: { payload: { '"userId"': userId } } });

    if (actions.length > 0) {
        throw new Error('All related actions should be deleted on User Delete');
    }
}

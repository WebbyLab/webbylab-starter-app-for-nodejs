import Action from '../../../../../../../lib/domain-model/StoredTriggerableAction.mjs';
import User   from '../../../../../../../lib/domain-model/User.mjs';
import DMX    from '../../../../../../../lib/domain-model/X.mjs';

export default async function checkSideEffects({ actionId, userId }) {
    try {
        const action = await Action.findById(actionId);

        throw new Error(`Action with id = "${action.id}" should be deleted`);
    } catch (x) {
        if (!(x instanceof DMX.WrongId)) {
            throw x;
        }
    }

    const user = await User.findById(userId);

    if (user.status !== 'ACTIVE') throw new Error(`User with email = ${user.email} should be ACTIVE`);
}

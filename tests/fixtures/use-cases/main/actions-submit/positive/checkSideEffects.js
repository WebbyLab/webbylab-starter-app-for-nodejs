import DMX    from '../../../../../../lib/domain-model/X.mjs';
import Action from '../../../../../../lib/domain-model/StoredTriggerableAction.mjs';

export default async function checkSideEffects({ actionId }) {
    try {
        const action = await Action.findById(actionId);

        throw new Error(`Action with id = "${action.id}" should be deleted`);
    } catch (x) {
        if (!(x instanceof DMX.WrongId)) {
            throw x;
        }
    }
}

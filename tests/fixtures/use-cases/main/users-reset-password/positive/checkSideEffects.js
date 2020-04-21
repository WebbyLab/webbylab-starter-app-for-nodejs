import Action from '../../../../../../lib/domain-model/StoredTriggerableAction.mjs';
import User   from '../../../../../../lib/domain-model/User.mjs';

export default async function checkSideEffects({ email }) {
    const user = await User.findOne({ where: { email } });

    const actions = await Action.findAll({ where : {
        payload : { '"userId"': user.id },
        type    : 'RESET_USER_PASSWORD'
    } });

    if (!actions.length) {
        throw new Error('Action with type "RESET_USER_PASSWORD" should be created');
    }
}

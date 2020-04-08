import Action     from '../../../../../../lib/domain-model/StoredTriggerableAction.mjs';

export default async function checkSideEffects({ userId }) {
    const actions = await Action.findAll({ where : {
        data : { '"userId"': userId },
        type : 'RESET_USER_PASSWORD'
    } });

    if (!actions.length) {
        throw new Error('Action with type "RESET_USER_PASSWORD" should be created');
    }
}

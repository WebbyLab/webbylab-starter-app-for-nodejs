import Action        from '../../../../../../../lib/domain-model/StoredTriggerableAction.mjs';
import ActionsSubmit from '../../../../../../../lib/use-cases/main/actions/Submit.mjs';

export default {
    useCaseClass : ActionsSubmit,
    before       : async (factory) => {
        await factory.standardSetup();
        const users  = await factory.setupUsers();
        const userId = users[1].id;

        const actions = await Action.bulkCreate([
            {
                type    : 'ACTIVATE_USER',
                payload : { userId }
            }
        ]);

        return { actionId: actions[0].id, userId };
    }
};

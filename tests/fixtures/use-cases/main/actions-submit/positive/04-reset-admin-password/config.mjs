import Action        from '../../../../../../../lib/domain-model/StoredTriggerableAction.mjs';
import ActionsSubmit from '../../../../../../../lib/use-cases/main/actions/Submit.mjs';

export default {
    useCaseClass : ActionsSubmit,
    before       : async (factory) => {
        await factory.standardSetup();
        const admins = await factory.setupAdmins();
        const adminId = admins[0].id;
        const actions = await Action.bulkCreate([
            {
                type    : 'RESET_ADMIN_PASSWORD',
                payload : { adminId }
            }
        ]);

        return { actionId: actions[0].id };
    }
};

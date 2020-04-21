import ActionsSubmit from '../../../../../../lib/use-cases/main/actions/Submit.mjs';

export default {
    useCaseClass : ActionsSubmit,
    before       : async (factory) => {
        await factory.standardSetup();
        const users = await factory.setupUsers();
        const admins = await factory.setupAdmins();

        const actions = await factory.setupActions(users[0].id, admins[0].id);

        const actionsMap = {};

        for (const action of actions) {
            actionsMap[action.type] = action.id;
        }

        return actionsMap;
    }
};

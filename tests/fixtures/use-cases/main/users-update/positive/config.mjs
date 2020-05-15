import UsersUpdate from '../../../../../../lib/use-cases/main/users/Update.mjs';

export default {
    useCaseClass : UsersUpdate,
    before       : async (factory) => {
        await factory.standardSetup();
        const users = await factory.setupUsers();
        const userId = users[0].id;

        return userId;
    }
};

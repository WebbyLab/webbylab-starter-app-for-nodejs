import UsersDelete from '../../../../../../lib/use-cases/main/users/Delete.mjs';

export default {
    useCaseClass : UsersDelete,
    before       : async (factory) => {
        await factory.standardSetup();
        const users = await factory.setupUsers();
        const userId = users[0].id;

        await factory.setupActions(userId);

        return userId;
    }
};

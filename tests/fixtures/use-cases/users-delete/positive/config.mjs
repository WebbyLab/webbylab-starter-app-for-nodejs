import UsersDelete from '../../../../../lib/use-cases/users/Delete.mjs';

export default {
    serviceClass : UsersDelete,
    before       : async (factory) => {
        await factory.standardSetup();
        const users = await factory.setupUsers();
        const userId = users[1].id;

        await factory.setupActions(userId);

        return userId;
    }
};

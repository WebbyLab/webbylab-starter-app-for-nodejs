import AdminUsersDelete from '../../../../../../lib/use-cases/admin/users/Delete.mjs';

export default {
    serviceClass : AdminUsersDelete,
    before       : async (factory) => {
        await factory.standardSetup();
        const users = await factory.setupUsers();
        const userId = users[0].id;

        await factory.setupActions(userId);

        return userId;
    }
};

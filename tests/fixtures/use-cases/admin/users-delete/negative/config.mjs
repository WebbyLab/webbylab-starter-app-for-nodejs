import AdminUsersDelete from '../../../../../../lib/use-cases/admin/users/Delete.mjs';

export default {
    serviceClass : AdminUsersDelete,
    before       : async (factory) => {
        await factory.standardSetup();

        const users = await factory.setupUsers();

        return users[0].id;
    }
};

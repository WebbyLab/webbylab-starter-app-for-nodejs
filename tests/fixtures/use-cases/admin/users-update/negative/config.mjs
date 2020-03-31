import AdminUsersUpdate from '../../../../../../lib/use-cases/admin/users/Update.mjs';

export default {
    serviceClass : AdminUsersUpdate,
    before       : async (factory) => {
        await factory.standardSetup();

        const users = await factory.setupUsers();

        return users[0].id;
    }
};

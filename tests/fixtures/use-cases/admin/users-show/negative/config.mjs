import AdminUsersShow from '../../../../../../lib/use-cases/admin/users/Show.mjs';

export default {
    serviceClass : AdminUsersShow,
    before       : async (factory) => {
        await factory.standardSetup();

        const users = await factory.setupUsers();

        return users[0].id;
    }
};

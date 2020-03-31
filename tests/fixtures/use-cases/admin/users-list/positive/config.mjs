import AdminUsersList from '../../../../../../lib/use-cases/admin/users/List.mjs';

export default {
    serviceClass : AdminUsersList,
    before       : async (factory) => {
        await factory.standardSetup();
        await factory.setupUsers();
    }
};

import AdminUsersCreate from '../../../../../../lib/use-cases/admin/users/Create.mjs';

export default {
    serviceClass : AdminUsersCreate,
    before       : async (factory) => {
        await factory.standardSetup();
        await factory.setupUsers();
    }
};

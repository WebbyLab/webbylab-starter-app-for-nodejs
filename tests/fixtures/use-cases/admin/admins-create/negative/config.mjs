import AdminsCreate from '../../../../../../lib/use-cases/admin/admins/Create.mjs';

export default {
    serviceClass : AdminsCreate,
    before       : async (factory) => {
        await factory.standardSetup();
        await factory.setupAdmins();
    }
};

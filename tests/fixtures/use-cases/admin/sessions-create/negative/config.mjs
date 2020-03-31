import AdminSessionsCreate from '../../../../../../lib/use-cases/admin/sessions/Create.mjs';

export default {
    serviceClass : AdminSessionsCreate,
    before       : async (factory) => {
        await factory.standardSetup();
        await factory.setupAdmins();
    }
};

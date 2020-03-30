import AdminsResetPassword from '../../../../../../lib/use-cases/admin/admins/ResetPassword.mjs';

export default {
    serviceClass : AdminsResetPassword,
    before       : async (factory) => {
        await factory.standardSetup();
        await factory.setupAdmins();
    }
};

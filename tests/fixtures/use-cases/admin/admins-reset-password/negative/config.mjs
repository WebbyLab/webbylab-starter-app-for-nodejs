import AdminsResetPassword from '../../../../../../lib/use-cases/admin/admins/ResetPassword.mjs';

export default {
    serviceClass : AdminsResetPassword,
    before       : async (factory) => {
        await factory.standardSetup();
        const admins = await factory.setupAdmins();

        return admins[0].id;
    }
};

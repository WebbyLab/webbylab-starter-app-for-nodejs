import AdminUsersResetPassword from '../../../../../../lib/use-cases/admin/users/ResetPassword.mjs';

export default {
    serviceClass : AdminUsersResetPassword,
    before       : async (factory) => {
        await factory.standardSetup();
        const users = await factory.setupUsers();
        const admins = await factory.setupAdmins();

        const adminId = admins[0].id;
        const userId = users[1].id;

        return { adminId, userId };
    }
};

import AdminUsersResetPassword from '../../../../../../lib/use-cases/admin/users/ResetPassword.mjs';

export default {
    useCaseClass : AdminUsersResetPassword,
    before       : async (factory) => {
        await factory.standardSetup();
        const users = await factory.setupUsers();
        const admins = await factory.setupAdmins();

        const adminId = admins[0].id;
        const userId = users[2].id;

        return { adminId, userId };
    }
};

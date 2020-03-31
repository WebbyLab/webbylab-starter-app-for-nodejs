import AdminUsersResetPassword from '../../../../../../lib/use-cases/admin/users/ResetPassword.mjs';

export default {
    serviceClass : AdminUsersResetPassword,
    before       : async (factory) => {
        await factory.standardSetup();
        const users = await factory.setupUsers();

        return users[2].id;
    }
};

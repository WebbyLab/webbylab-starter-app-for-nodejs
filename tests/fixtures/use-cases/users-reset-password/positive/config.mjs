import UsersResetPassword from '../../../../../lib/use-cases/users/ResetPassword.mjs';

export default {
    serviceClass : UsersResetPassword,
    before       : async (factory) => {
        await factory.standardSetup();
        await factory.setupUsers();
    }
};

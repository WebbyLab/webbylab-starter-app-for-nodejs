import UsersResetPassword from '../../../../../../lib/use-cases/main/users/ResetPassword.mjs';

export default {
    useCaseClass : UsersResetPassword,
    before       : async (factory) => {
        await factory.standardSetup();
        await factory.setupUsers();
    }
};

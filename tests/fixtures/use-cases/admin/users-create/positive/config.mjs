import AdminUsersCreate from '../../../../../../lib/use-cases/admin/users/Create.mjs';

export default {
    useCaseClass : AdminUsersCreate,
    before       : async (factory) => {
        await factory.standardSetup();
        await factory.setupUsers();
        const admins = await factory.setupAdmins();

        return admins[0].id;
    }
};

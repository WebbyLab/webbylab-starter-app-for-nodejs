import AdminUsersShow from '../../../../../../../lib/use-cases/admin/users/Show.mjs';

export default {
    useCaseClass : AdminUsersShow,
    before       : async (factory) => {
        await factory.standardSetup();
        const users = await factory.setupUsers();
        const admins = await factory.setupAdmins();

        const adminId = admins[0].id;
        const userId = users[2].id;

        return { adminId, userId };
    }
};

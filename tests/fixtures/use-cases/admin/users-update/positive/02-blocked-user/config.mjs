import AdminUsersUpdate from '../../../../../../../lib/use-cases/admin/users/Update.mjs';

export default {
    useCaseClass : AdminUsersUpdate,
    before       : async (factory) => {
        await factory.standardSetup();
        const users = await factory.setupUsers();
        const admins = await factory.setupAdmins();

        const adminId = admins[0].id;
        const userId = users[2].id;

        return { adminId, userId };
    }
};

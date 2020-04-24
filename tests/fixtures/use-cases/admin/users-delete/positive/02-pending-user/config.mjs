import AdminUsersDelete from '../../../../../../../lib/use-cases/admin/users/Delete.mjs';

export default {
    useCaseClass : AdminUsersDelete,
    before       : async (factory) => {
        await factory.standardSetup();
        const users = await factory.setupUsers();
        const admins = await factory.setupAdmins();

        const userId = users[0].id;
        const adminId = admins[0].id;

        await factory.setupActions(userId);

        return { userId, adminId };
    }
};

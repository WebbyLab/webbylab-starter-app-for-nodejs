import AdminsDelete from '../../../../../../lib/use-cases/admin/admins/Delete.mjs';

export default {
    useCaseClass : AdminsDelete,
    before       : async (factory) => {
        await factory.standardSetup();
        const admins = await factory.setupAdmins();

        const adminId = admins[0].id;

        await factory.setupActions('', adminId);

        return adminId;
    }
};

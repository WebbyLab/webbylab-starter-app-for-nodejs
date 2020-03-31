import AdminAdminsDelete from '../../../../../../lib/use-cases/admin/admins/Delete.mjs';

export default {
    serviceClass : AdminAdminsDelete,
    before       : async (factory) => {
        await factory.standardSetup();

        const users = await factory.setupAdmins();

        return users[0].id;
    }
};

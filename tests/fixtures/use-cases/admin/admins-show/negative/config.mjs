import AdminAdminsShow from '../../../../../../lib/use-cases/admin/admins/Show.mjs';

export default {
    serviceClass : AdminAdminsShow,
    before       : async (factory) => {
        await factory.standardSetup();

        const users = await factory.setupAdmins();

        return users[0].id;
    }
};

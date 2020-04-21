import AdminAdminsShow from '../../../../../../lib/use-cases/admin/admins/Show.mjs';

export default {
    useCaseClass : AdminAdminsShow,
    before       : async (factory) => {
        await factory.standardSetup();
        const admins = await factory.setupAdmins();

        return admins[0].id;
    }
};

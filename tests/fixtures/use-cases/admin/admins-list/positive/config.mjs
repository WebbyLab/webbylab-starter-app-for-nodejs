import AdmnisList from '../../../../../../lib/use-cases/admin/admins/List.mjs';

export default {
    useCaseClass : AdmnisList,
    before       : async (factory) => {
        await factory.standardSetup();
        const admins = await factory.setupAdmins();

        return admins[0].id;
    }
};

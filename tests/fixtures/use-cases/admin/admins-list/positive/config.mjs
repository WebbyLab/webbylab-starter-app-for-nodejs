import AdmnisList from '../../../../../../lib/use-cases/admin/admins/List.mjs';

export default {
    serviceClass : AdmnisList,
    before       : async (factory) => {
        await factory.standardSetup();
        await factory.setupAdmins();
    }
};

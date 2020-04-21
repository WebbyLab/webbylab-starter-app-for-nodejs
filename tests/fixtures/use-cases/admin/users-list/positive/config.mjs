import AdminUsersList from '../../../../../../lib/use-cases/admin/users/List.mjs';

export default {
    useCaseClass : AdminUsersList,
    before       : async (factory) => {
        await factory.standardSetup();
        await factory.setupUsers();
        const admins = await factory.setupAdmins();

        return admins[0].id;
    }
};

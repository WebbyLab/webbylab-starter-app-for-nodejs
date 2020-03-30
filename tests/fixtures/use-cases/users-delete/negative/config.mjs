import UsersDelete from '../../../../../lib/use-cases/users/Delete.mjs';

export default {
    serviceClass : UsersDelete,
    before       : async (factory) => {
        await factory.standardSetup();

        const users = await factory.setupUsers();

        return users[0].id;
    }
};

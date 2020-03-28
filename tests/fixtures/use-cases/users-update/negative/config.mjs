import UsersUpdate from '../../../../../lib/use-cases/users/Update.mjs';

export default {
    serviceClass : UsersUpdate,
    before       : async (factory) => {
        await factory.standardSetup();

        const users = await factory.setupUsers();

        return users[0].id;
    }
};

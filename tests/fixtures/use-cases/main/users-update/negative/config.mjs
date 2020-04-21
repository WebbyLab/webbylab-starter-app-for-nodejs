import UsersUpdate from '../../../../../../lib/use-cases/main/users/Update.mjs';

export default {
    serviceClass : UsersUpdate,
    before       : async (factory) => {
        await factory.standardSetup();

        const users = await factory.setupUsers();

        return users[1].id;
    }
};

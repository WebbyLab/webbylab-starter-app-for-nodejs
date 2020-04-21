import UsersShow from '../../../../../../lib/use-cases/main/users/Show.mjs';

export default {
    serviceClass : UsersShow,
    before       : async (factory) => {
        await factory.standardSetup();

        const users = await factory.setupUsers();

        return users[1].id;
    }
};

import UsersShow from '../../../../../../lib/use-cases/users/Show.mjs';

export default {
    serviceClass : UsersShow,
    before       : async (factory) => {
        await factory.standardSetup();

        const users = await factory.setupUsers();

        return users[0].id;
    }
};

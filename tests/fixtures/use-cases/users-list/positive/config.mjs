import UsersList from '../../../../../lib/use-cases/users/List.mjs';

export default {
    serviceClass : UsersList,
    before       : async (factory) => {
        await factory.standardSetup();
        await factory.setupUsers();
    }
};

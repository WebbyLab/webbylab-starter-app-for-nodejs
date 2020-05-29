import UsersList from '../../../../../../lib/use-cases/main/users/List.mjs';

export default {
    useCaseClass : UsersList,
    before       : async (factory) => {
        await factory.standardSetup();
        const users = await factory.setupUsers();

        return users[0].id;
    }
};

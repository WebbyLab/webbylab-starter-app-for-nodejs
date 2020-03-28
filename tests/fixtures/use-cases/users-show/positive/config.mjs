import UsersShow from '../../../../../lib/use-cases/users/Show.mjs';

class WrappedUsersShow extends UsersShow {
    constructor(...params) {
        super(...params);

        this.context = { ...this.context, ...WrappedUsersShow.context };
    }

    static context = {};
}

export default {
    serviceClass : WrappedUsersShow,
    before       : async (factory) => {
        await factory.standardSetup();
        const users = await factory.setupUsers();
        const userId = users[0].id;

        WrappedUsersShow.context = { userId };

        return userId;
    }
};

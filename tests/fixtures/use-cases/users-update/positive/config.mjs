import UsersUpdate from '../../../../../lib/use-cases/users/Update.mjs';

class WrappedUsersUpdate extends UsersUpdate {
    constructor(...params) {
        super(...params);

        this.context = { ...this.context, ...WrappedUsersUpdate.context };
    }

    static context = {};
}

export default {
    serviceClass : WrappedUsersUpdate,
    before       : async (factory) => {
        await factory.standardSetup();
        const users = await factory.setupUsers();
        const userId = users[0].id;

        WrappedUsersUpdate.context = { userId };

        return userId;
    }
};

import UsersDelete from '../../../../../lib/use-cases/users/Delete.mjs';

class WrappedUsersDelete extends UsersDelete {
    constructor(...params) {
        super(...params);

        this.context = { ...this.context, ...WrappedUsersDelete.context };
    }

    static context = {};
}

export default {
    serviceClass : WrappedUsersDelete,
    before       : async (factory) => {
        await factory.standardSetup();
        const users = await factory.setupUsers();

        const userId = users[0].id;

        WrappedUsersDelete.context = { userId };

        return userId;
    }
};

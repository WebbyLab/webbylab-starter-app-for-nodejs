import User from '../../lib/domain-model/User.mjs';

class TestFactory {
    constructor() {

    }

    async standardSetup() {

    }

    async setupUsers() {
        return this._createDefaultUsers();
    }

    async _createDefaultUsers() {
        const users = [
            {
                email          : 'default1@gmail.com',
                firstName      : 'First',
                secondName     : 'Default',
                password       : 'password',
                status         : 'PENDING',
                agreeWithTerms : true
            },
            {
                email          : 'default2@gmail.com',
                firstName      : 'Second',
                secondName     : 'Default',
                password       : 'password',
                status         : 'ACTIVE',
                agreeWithTerms : true
            }
        ];
        const savedUsers = await User.bulkCreate(users);

        return savedUsers;
    }
}

export default TestFactory;

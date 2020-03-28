import Action from '../../lib/domain-model/Action.mjs';
import User   from '../../lib/domain-model/User.mjs';

class TestFactory {
    constructor() {

    }

    async standardSetup() {

    }

    async setupUsers() {
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
            },
            {
                email          : 'default3@gmail.com',
                firstName      : 'Third',
                secondName     : 'Default',
                password       : 'password',
                status         : 'BLOCKED',
                agreeWithTerms : true
            }
        ];
        const savedUsers = await User.bulkCreate(users);

        return savedUsers;
    }

    async setupActions(userId) {
        const actions = [
            {
                type : 'ACTIVATE_USER',
                data : { userId }
            },
            {
                type : 'RESET_USER_PASSWORD',
                data : { userId }
            }
        ];
        const savedActions = await Action.bulkCreate(actions);

        return savedActions;
    }
}

export default TestFactory;

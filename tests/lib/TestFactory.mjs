import StoredTriggerableAction from '../../lib/domain-model/StoredTriggerableAction.mjs';
import Admin                   from '../../lib/domain-model/Admin.mjs';
import User                    from '../../lib/domain-model/User.mjs';

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

    async setupAdmins() {
        const admins = [
            {
                email          : 'admin1@gmail.com',
                firstName      : 'First',
                secondName     : 'Default',
                password       : 'password',
                status         : 'PENDING',
                agreeWithTerms : true
            },
            {
                email          : 'admin2@gmail.com',
                firstName      : 'Second',
                secondName     : 'Default',
                password       : 'password',
                status         : 'ACTIVE',
                agreeWithTerms : true
            }
        ];
        const savedAdmins = await Admin.bulkCreate(admins);

        return savedAdmins;
    }

    async setupActions(userId, adminId) {
        const actions = [
            {
                type    : 'ACTIVATE_USER',
                payload : { userId }
            },
            {
                type    : 'RESET_USER_PASSWORD',
                payload : { userId }
            },
            {
                type    : 'RESET_ADMIN_PASSWORD',
                payload : { adminId }
            }
        ];
        const savedActions = await StoredTriggerableAction.bulkCreate(actions);

        return savedActions;
    }
}

export default TestFactory;

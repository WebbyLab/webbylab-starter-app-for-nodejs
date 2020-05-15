import nodemailerMock          from 'nodemailer-mock';
import StoredTriggerableAction from '../../lib/domain-model/StoredTriggerableAction.mjs';

import Admin from '../../lib/domain-model/Admin.mjs';
import admins from '../fixtures/data/admins.json';

import User from '../../lib/domain-model/User.mjs';
import users from '../fixtures/data/users.json';

class TestFactory {
    async setupAdmins() {
        const savedAdmins = await Admin.bulkCreate(admins);

        return savedAdmins;
    }

    async setupUsers() {
        const savedUsers = await User.bulkCreate(users);

        return savedUsers;
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

    async standardSetup() {
        nodemailerMock.mock.reset();
    }
}

export default TestFactory;

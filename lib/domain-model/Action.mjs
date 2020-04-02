import { DataTypes as DT } from '../../packages.mjs';

import logger              from '../utils/logger.mjs';
import Base                from './Base.mjs';
import User                from './User.mjs';
import Admin               from './Admin.mjs';


const METHODS_BY_TYPE = {
    'ACTIVATE_USER'        : 'activateUser',
    'RESET_USER_PASSWORD'  : 'resetUserPassword',
    'RESET_ADMIN_PASSWORD' : 'resetAdminPassword'
};

class Action extends Base {
    static schema = {
        id   : { type: DT.UUID, defaultValue: DT.UUIDV4, primaryKey: true },
        type : { type: DT.ENUM('ACTIVATE_USER', 'RESET_USER_PASSWORD', 'RESET_ADMIN_PASSWORD'), allowNull: false },
        data : { type: DT.JSON, allowNull: false, defaultValue: {} }
    };

    static initHooks() {
        this.afterCreate(action => {
            process.env.LAST_ACTION_ID = action.dataValues.id; // For testing
        });
    }

    // TODO: add runAndDelete
    async run(data) {
        const method = METHODS_BY_TYPE[this.type];

        logger.info({
            action : `Action called method: ${method}`,
            type   : this.type,
            data
        });

        return this[method](data);
    }

    async activateUser() {
        const user = await User.findById(this.data.userId);

        return user.activate();
    }

    async resetUserPassword({ password }) {
        const user = await User.findById(this.data.userId);

        return user.resetPassword({ password });
    }

    async resetAdminPassword({ password }) {
        const admin = await Admin.findById(this.data.adminId);

        return admin.resetPassword({ password });
    }
}


export default Action;

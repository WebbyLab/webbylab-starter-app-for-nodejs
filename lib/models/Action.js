import { DataTypes as DT } from '../../packages.js';

import Base                from './Base.js';
import User                from './User.js';
import Admin               from './Admin.js';


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

    async run(data) {
        const method = METHODS_BY_TYPE[this.type];

        return this[method](data);
    }

    /* istanbul ignore next */
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

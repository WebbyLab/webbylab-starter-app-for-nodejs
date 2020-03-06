import { DataTypes as DT } from '../../packages.js';

import Base                from './Base.js';
import User                from './User.js';


const METHODS_BY_TYPE = {
    'CONFIRM_EMAIL'  : 'confirmEmail',
    'RESET_PASSWORD' : 'resetPassword'
};

class Action extends Base {
    static schema = {
        id   : { type: DT.UUID, defaultValue: DT.UUIDV4, primaryKey: true },
        type : { type: DT.ENUM('CONFIRM_EMAIL', 'RESET_PASSWORD'), allowNull: false },
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
    async confirmEmail() {
        const user = await User.findById(this.data.userId);

        return user.update({ status: 'ACTIVE' });
    }

    async resetPassword({ password }) {
        const user = await User.findById(this.data.userId);

        return user.update({ password });
    }
}


export default Action;

import { DataTypes as DT } from '../../packages.mjs';

import logger              from '../utils/logger.mjs';
import Base                from './Base.mjs';
import User                from './User.mjs';
import Admin               from './Admin.mjs';
import { ObjectBlocked, EmptyObject, NotImplemented } from './X.mjs';


export const TYPES = {
    'ACTIVATE_USER'        : 'ACTIVATE_USER',
    'RESET_USER_PASSWORD'  : 'RESET_USER_PASSWORD',
    'RESET_ADMIN_PASSWORD' : 'RESET_ADMIN_PASSWORD'
};

const CREATE_METHODS_BY_TYPE = {
    [TYPES.ACTIVATE_USER]        : '_createActivateUserAction',
    [TYPES.RESET_USER_PASSWORD]  : '_createResetUserPasswordAction',
    [TYPES.RESET_ADMIN_PASSWORD] : '_createResetAdminPasswordAction'
};

const RUN_METHODS_BY_TYPE = {
    [TYPES.ACTIVATE_USER]        : 'activateUser',
    [TYPES.RESET_USER_PASSWORD]  : 'resetUserPassword',
    [TYPES.RESET_ADMIN_PASSWORD] : 'resetAdminPassword'
};

class StoredTriggerableAction extends Base {
    static schema = {
        id   : { type: DT.UUID, defaultValue: DT.UUIDV4, primaryKey: true },
        type : { type: DT.ENUM(Object.values(TYPES)), allowNull: false },
        data : { type: DT.JSON, allowNull: false, defaultValue: {} }
    };

    static initHooks() {}

    static async create({ type, object } = {}) {
        const method = CREATE_METHODS_BY_TYPE[type];

        if (!this[method]) {
            throw new NotImplemented({
                message : `${this.name} has no implementation for type = "${type}"`,
                field   : 'type'
            });
        }

        logger.info({
            action : `${this.name} called CREATE method: ${method}`,
            type
        });

        return this[method](object);
    }

    static async _createActivateUserAction(user) {
        if (!user) {
            throw new EmptyObject({
                message : 'User not found',
                field   : 'USER'
            });
        }

        return super.create({
            type : TYPES.ACTIVATE_USER,
            data : {
                userId : user.id,
                email  : user.email
            }
        });
    }

    static async _createResetUserPasswordAction(user) {
        if (!user) {
            throw new EmptyObject({
                message : 'User not found',
                field   : 'USER'
            });
        }

        if (user.status === 'BLOCKED') {
            throw new ObjectBlocked({
                message : `User with id = "${user.id}" is blocked`,
                field   : 'USER'
            });
        }

        return super.create({
            type : TYPES.RESET_USER_PASSWORD,
            data : {
                userId : user.id,
                email  : user.email
            }
        });
    }

    static async _createResetAdminPasswordAction(admin) {
        if (!admin) {
            throw new EmptyObject({
                message : 'Admin not found',
                field   : 'ADMIN'
            });
        }

        return super.create({
            type : TYPES.RESET_ADMIN_PASSWORD,
            data : {
                adminId : admin.id,
                email   : admin.email
            }
        });
    }

    // TODO: add runAndDelete
    async run(data) {
        const method = RUN_METHODS_BY_TYPE[this.type];

        if (!this[method]) {
            throw new NotImplemented({
                message : `${this.name} has no implementation for type = "${this.type}"`,
                field   : 'type'
            });
        }

        logger.info({
            action : `${this.name} called RUN method: ${method}`,
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

export default StoredTriggerableAction;

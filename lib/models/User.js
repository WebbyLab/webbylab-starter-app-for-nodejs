import { DataTypes as DT } from 'sequelize';
import bcrypt              from 'bcryptjs';

import config              from '../../etc/config';
import Base                from './Base';

const SALT_ROUNDS = 2;

class User extends Base {
    // static init(sequelize) {
    //     super.init(sequelize, { paranoid: true });
    // }

    static schema = {
        id             : { type: DT.UUID, defaultValue: DT.UUIDV4, primaryKey: true },
        email          : { type: DT.STRING, allowNull: false, unique: true },
        status         : { type: DT.ENUM('ACTIVE', 'BLOCKED', 'PENDING'), defaultValue: 'PENDING' },
        role           : { type: DT.ENUM('ADMIN', 'USER') },
        firstName      : { type: DT.STRING, defaultValue: '' },
        secondName     : { type: DT.STRING, defaultValue: '' },
        avatar         : { type: DT.STRING, defaultValue: '' },
        lang           : { type: DT.STRING, defaultValue: config.defaultLang },
        agreeWithTerms : { type: DT.BOOLEAN, allowNull: false },
        passwordHash   : { type: DT.STRING },
        // updatedBy      : { type: DT.UUID, defaultValue: '' },
        password       : { type : DT.VIRTUAL,
            set(password) {
                this.setDataValue('passwordHash', this._hashPassword(password));
            } }
    };

    static initRelations() {

    }

    checkPassword(plain) {
        return bcrypt.compare(plain, this.passwordHash);
    }

    _hashPassword(password) {
        const salt = bcrypt.genSaltSync(SALT_ROUNDS); // eslint-disable-line no-sync

        return bcrypt.hashSync(password, salt); // eslint-disable-line no-sync
    }
}

export default User;

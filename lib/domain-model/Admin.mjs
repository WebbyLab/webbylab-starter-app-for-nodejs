import crypto              from 'crypto';
import { DataTypes as DT } from '../../packages.mjs';

import Base                from './Base.mjs';

const SALT_LENGTH = 16;
const KEY_LENGTH  = 64;

class Admin extends Base {
    static schema = {
        id           : { type: DT.UUID, defaultValue: DT.UUIDV4, primaryKey: true },
        email        : { type: DT.STRING, allowNull: false, unique: true },
        passwordHash : { type: DT.STRING },
        salt         : { type: DT.STRING },
        password     : { type : DT.VIRTUAL,
            set(password) {
                const salt = this._generateSalt();

                this.setDataValue('salt', salt);
                this.setDataValue('passwordHash', this._hashPassword(password, salt));
            } }
    };

    checkPassword(plain) {
        const hash = this._hashPassword(plain, this.salt);

        return hash === this.passwordHash;
    }

    _generateSalt() {
        const salt = crypto.randomBytes(SALT_LENGTH);

        return salt.toString('hex');
    }

    _hashPassword(password, salt) {
        const hash = crypto.scryptSync(password, salt, KEY_LENGTH); // eslint-disable-line no-sync

        return hash.toString('hex');
    }

    // Actions
    resetPassword({ password }) {
        return this.update({ password });
    }
}

export default Admin;

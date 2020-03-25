import jwt      from 'jsonwebtoken';

import {
    promisify,
    Exception as X
} from '../../../../packages.mjs';

import Base from '../../Base.mjs';
import config      from '../../../config.cjs';
import Admin       from '../../../domain-model/Admin.mjs';

const jwtVerify = promisify(jwt.verify);

export default class SessionsCheck extends Base {
    static validationRules = {
        token : [ 'required', 'string' ]
    };

    async execute({ token }) {
        try {
            const adminData = await jwtVerify(token, config.secret);
            const admin  = await Admin.findOne({ where: { id: adminData.id } });

            if (!admin) throw new Error('USER_NOT_VALID');

            return adminData;
        } catch (error) {
            const message = [ 'USER_NOT_VALID' ].includes(error.message)
                ? error.message
                : 'WRONG_TOKEN';

            throw new X({
                code   : 'WRONG_TOKEN',
                fields : { token: message }
            });
        }
    }
}

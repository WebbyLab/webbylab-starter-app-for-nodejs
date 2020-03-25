import jwt      from 'jsonwebtoken';

import {
    promisify,
    Exception as X
} from '../../../../packages.mjs';

import ServiceBase from '../../ServiceBase.mjs';
import config      from '../../../config.mjs';
import Admin       from '../../../models/Admin.mjs';

const jwtVerify = promisify(jwt.verify);

export default class SessionsCheck extends ServiceBase {
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

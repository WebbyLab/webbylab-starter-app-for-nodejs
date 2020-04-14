import jwt      from 'jsonwebtoken';

import {
    promisify,
    Exception as X
} from '../../../../packages.mjs';

import Base   from '../../Base.mjs';
import config from '../../../config.cjs';
import Admin  from '../../../domain-model/Admin.mjs';
import DMX    from '../../../domain-model/X.mjs';

const jwtVerify = promisify(jwt.verify);

export default class SessionsCheck extends Base {
    static validationRules = {
        token : [ 'required', 'string' ]
    };

    async execute({ token }) {
        try {
            const adminData = await jwtVerify(token, config.secret);

            await Admin.findById(adminData.id);

            return adminData;
        } catch (x) {
            if (x instanceof DMX.WrongId) {
                throw new X({
                    code   : 'WRONG_TOKEN',
                    fields : { token: 'WRONG_ID' }
                });
            }

            throw new X({
                code   : 'WRONG_TOKEN',
                fields : { token: 'WRONG_TOKEN' }
            });
        }
    }
}

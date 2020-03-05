import { promisify }  from 'bluebird';
import jwt            from 'jsonwebtoken';
import ServiceBase    from 'chista/ServiceBase';
import X              from 'chista/Exception';

import { secret }     from '../../../etc/config.js';
import { User }       from '../../models.js';

const jwtVerify = promisify(jwt.verify);

export default class SessionsCheck extends ServiceBase {
    static validationRules = {
        token : [ 'required', 'string' ]
    };

    async execute({ token }) {
        try {
            const userData = await jwtVerify(token, secret);
            const user  = await User.findOne({ where: { id: userData.id } });

            if (!user) throw new Error('USER_NOT_VALID');

            if (user.status !== 'ACTIVE') throw new Error('USER_NOT_ACTIVE');

            return userData;
        } catch (error) {
            const message = [ 'USER_NOT_VALID', 'USER_NOT_ACTIVE' ].includes(error.message)
                ? error.message
                : 'WRONG_TOKEN';

            throw new X({
                code   : 'WRONG_TOKEN',
                fields : { token: message }
            });
        }
    }
}

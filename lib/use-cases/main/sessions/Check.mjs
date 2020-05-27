import {
    Exception as X
} from '../../../../packages.mjs';

import Base   from '../../Base.mjs';
import User   from '../../../domain-model/User.mjs';
import DMX    from '../../../domain-model/X.mjs';

import { verifyToken } from '../../utils/jwtUtils.mjs';

export default class SessionsCheck extends Base {
    static validationRules = {
        token : [ 'required', 'string' ]
    };

    async execute({ token }) {
        try {
            const userData = await verifyToken(token);
            const user = await User.findById(userData.id);

            if (user.status !== 'ACTIVE') throw new Error('USER_NOT_ACTIVE');

            return userData;
        } catch (x) {
            if (x instanceof DMX.WrongId) {
                throw new X({
                    code   : 'WRONG_TOKEN',
                    fields : { token: 'WRONG_ID' }
                });
            }

            if (x instanceof DMX.InactiveObject) {
                throw new X({
                    code   : 'WRONG_TOKEN',
                    fields : { token: 'USER_NOT_ACTIVE' }
                });
            }

            throw new X({
                code   : 'WRONG_TOKEN',
                fields : { token: 'WRONG_TOKEN' }
            });
        }
    }
}

import {
    Exception as X
} from '../../../../packages.mjs';

import Base   from '../../Base.mjs';
import Admin  from '../../../domain-model/Admin.mjs';
import DMX    from '../../../domain-model/X.mjs';

import { verifyToken } from '../../utils/jwtUtils.mjs';

export default class AdminSessionsCheck extends Base {
    static validationRules = {
        token : [ 'required', 'string' ]
    };

    async execute({ token }) {
        try {
            const adminData = await verifyToken(token);

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

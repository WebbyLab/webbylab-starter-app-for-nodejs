import chista from '../chista.js';

import SessionsCreate from '../services/sessions/Create';
import SessionsCheck from '../services/sessions/Check';

export default {
    create : chista.makeServiceRunner(SessionsCreate, req => req.body),

    async check(req, res, next) {
        const promise = chista.runService(SessionsCheck, {
            params : { token: req.query.token }
        });

        try {
            const userData = await promise;

            /* eslint no-param-reassign: 0 */
            req.session = {
                context : {
                    userId     : userData.id,
                    userStatus : userData.status,
                    userRole   : userData.role
                }
            };

            return next();
        } catch (e) {
            return chista.renderPromiseAsJson(req, res, promise);
        }
    }
};

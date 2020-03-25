import chista         from '../../../chista.mjs';

import SessionsCreate from '../../../use-cases/sessions/Create.mjs';
import SessionsCheck  from '../../../use-cases/sessions/Check.mjs';

export default {
    create : chista.makeServiceRunner(SessionsCreate, req => req.body),

    async check(req, res, next) {
        const promise = chista.runService(SessionsCheck, {
            params : { token: req.headers.authorization }
        });

        try {
            const userData = await promise;

            /* eslint no-param-reassign: 0 */
            req.session = {
                context : {
                    userId : userData.id
                    // userStatus : userData.status
                }
            };

            return next();
        } catch (e) {
            return chista.renderPromiseAsJson(req, res, promise);
        }
    }
};

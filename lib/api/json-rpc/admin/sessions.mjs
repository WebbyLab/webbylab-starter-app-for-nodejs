import chista from '../chista.mjs';

import SessionsCreate from '../../../use-cases/admin/sessions/Create.mjs';
// import SessionsCheck  from '../../../use-cases/admin/sessions/Check.mjs';

export default {
    AdminSessionsCreate : chista.makeUseCaseRunner(SessionsCreate)

    // async check(req, res, next) {
    //     const promise = chista.runUseCase(SessionsCheck, {
    //         params : { token: req.headers.authorization }
    //     });

    //     try {
    //         const adminData = await promise;

    //         /* eslint no-param-reassign: 0 */
    //         req.session = {
    //             context : {
    //                 adminId : adminData.id
    //             }
    //         };

    //         return next();
    //     } catch (e) {
    //         return chista.renderPromiseAsJson(req, res, promise);
    //     }
    // }
};

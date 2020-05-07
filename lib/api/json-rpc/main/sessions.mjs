import chista         from '../chista.mjs';
import SessionsCreate from '../../../use-cases/main/sessions/Create.mjs';
// import SessionsCheck  from '../../../use-cases/main/sessions/Check.mjs';

export default {
    SessionsCreate : chista.makeUseCaseRunner(SessionsCreate)
    // SessionsCheck  : async (...params) => {
    //     try {
    //         const userData = await chista.runUseCase(SessionsCheck, {
    //             params : { token: params[0].token }
    //         });
    //         return true;
    //     } catch (e) {
    //         return false;
    //     }
    // }
};

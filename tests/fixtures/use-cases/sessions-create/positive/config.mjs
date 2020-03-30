import SessionsCreate from '../../../../../lib/use-cases/sessions/Create.mjs';

export default {
    serviceClass : SessionsCreate,
    before       : async (factory) => {
        await factory.standardSetup();
        await factory.setupUsers();
    }
};

import SessionsCreate from '../../../../../../lib/use-cases/main/sessions/Create.mjs';

export default {
    useCaseClass : SessionsCreate,
    before       : async (factory) => {
        await factory.standardSetup();
        await factory.setupUsers();
    }
};

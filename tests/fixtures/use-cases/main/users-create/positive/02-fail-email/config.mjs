import nodemailerMock from 'nodemailer-mock';
import UsersCreate    from '../../../../../../../lib/use-cases/main/users/Create.mjs';

// export const useCaseClass = UsersCreate;
// export async function before(factory) {
//     await factory.standardSetup();
//     await factory.setupUsers();
// }

export default {
    useCaseClass : UsersCreate,
    before       : async (factory) => {
        await factory.standardSetup();
        await factory.setupUsers();
        nodemailerMock.mock.setShouldFailOnce();
    }
};

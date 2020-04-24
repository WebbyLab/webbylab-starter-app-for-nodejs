import nodemailerMock from 'nodemailer-mock';
import UsersCreate    from '../../../../../../../lib/use-cases/main/users/Create.mjs';

export default {
    useCaseClass : UsersCreate,
    before       : async (factory) => {
        await factory.standardSetup();
        await factory.setupUsers();
        nodemailerMock.mock.setShouldFailOnce();

        const admins = await factory.setupAdmins();

        return admins[0].id;
    }
};

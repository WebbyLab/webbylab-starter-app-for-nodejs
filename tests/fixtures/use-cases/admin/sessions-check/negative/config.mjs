import jwt           from 'jsonwebtoken';
import config        from '../../../../../../lib/config.cjs';
import AdminSessionsCheck from '../../../../../../lib/use-cases/admin/sessions/Check.mjs';

export default {
    useCaseClass : AdminSessionsCheck,
    before       : async (factory) => {
        await factory.standardSetup();
        const admins = await factory.setupAdmins();
        const tokens = {
            'email-for-worng-token' : 'wrong-token',
            'not-existing-email'    : jwt.sign({ id: '50f792b5-3478-4c59-be6e-b3ba665e0bf1' }, config.secret)
        };

        for (const admin of admins) {
            tokens[admin.email] = jwt.sign({ id: admin.id }, config.secret);
        }

        return tokens;
    }
};

import { generateToken }  from '../../../../../../lib/use-cases/utils/jwtUtils.mjs';
import AdminSessionsCheck from '../../../../../../lib/use-cases/admin/sessions/Check.mjs';

export default {
    useCaseClass : AdminSessionsCheck,
    before       : async (factory) => {
        await factory.standardSetup();
        const admins = await factory.setupAdmins();
        const tokens = {
            'email-for-worng-token' : 'wrong-token',
            'not-existing-email'    : generateToken({ id: '50f792b5-3478-4c59-be6e-b3ba665e0bf1' })
        };

        for (const admin of admins) {
            tokens[admin.email] = generateToken({ id: admin.id });
        }

        return tokens;
    }
};

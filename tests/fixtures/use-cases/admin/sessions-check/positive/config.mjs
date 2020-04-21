import { generateToken }  from '../../../../../../lib/use-cases/utils/jwtUtils.mjs';
import AdminSessionsCheck from '../../../../../../lib/use-cases/admin/sessions/Check.mjs';

export default {
    useCaseClass : AdminSessionsCheck,
    before       : async (factory) => {
        await factory.standardSetup();
        const admins = await factory.setupAdmins();
        const tokens = {};

        for (const admin of admins) {
            tokens[admin.email] = generateToken({ id: admin.id });
        }

        return tokens;
    }
};

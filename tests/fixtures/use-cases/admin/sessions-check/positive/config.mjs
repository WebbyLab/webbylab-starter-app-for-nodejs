import jwt                from 'jsonwebtoken';
import config             from '../../../../../../lib/config.cjs';
import AdminSessionsCheck from '../../../../../../lib/use-cases/admin/sessions/Check.mjs';

export default {
    useCaseClass : AdminSessionsCheck,
    before       : async (factory) => {
        await factory.standardSetup();
        const admins = await factory.setupAdmins();
        const tokens = {};

        for (const admin of admins) {
            tokens[admin.email] = jwt.sign({ id: admin.id }, config.secret);
        }

        return tokens;
    }
};

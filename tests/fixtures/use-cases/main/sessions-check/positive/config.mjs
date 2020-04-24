import { generateToken } from '../../../../../../lib/use-cases/utils/jwtUtils.mjs';
import SessionsCheck     from '../../../../../../lib/use-cases/main/sessions/Check.mjs';

export default {
    useCaseClass : SessionsCheck,
    before       : async (factory) => {
        await factory.standardSetup();
        const users = await factory.setupUsers();
        const tokens = {};

        for (const user of users) {
            tokens[user.email] = generateToken({ id: user.id });
        }

        return tokens;
    }
};

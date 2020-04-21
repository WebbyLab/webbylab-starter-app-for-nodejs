import { generateToken } from '../../../../../../lib/use-cases/utils/jwtUtils.mjs';
import SessionsCheck     from '../../../../../../lib/use-cases/main/sessions/Check.mjs';

export default {
    useCaseClass : SessionsCheck,
    before       : async (factory) => {
        await factory.standardSetup();
        const users = await factory.setupUsers();
        const tokens = {
            'email-for-worng-token' : 'wrong-token',
            'not-existing-email'    : generateToken({ id: '50f792b5-3478-4c59-be6e-b3ba665e0bf1' })
        };

        for (const user of users) {
            tokens[user.email] = generateToken({ id: user.id });
        }

        return tokens;
    }
};

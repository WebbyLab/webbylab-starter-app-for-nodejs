import jwt           from 'jsonwebtoken';
import config        from '../../../../../../lib/config.cjs';
import SessionsCheck from '../../../../../../lib/use-cases/main/sessions/Check.mjs';

export default {
    useCaseClass : SessionsCheck,
    before       : async (factory) => {
        await factory.standardSetup();
        const users = await factory.setupUsers();
        const tokens = {
            'email-for-worng-token' : 'wrong-token',
            'not-existing-email'    : jwt.sign({ id: '50f792b5-3478-4c59-be6e-b3ba665e0bf1' }, config.secret)
        };

        for (const user of users) {
            tokens[user.email] = jwt.sign({ id: user.id }, config.secret);
        }

        return tokens;
    }
};

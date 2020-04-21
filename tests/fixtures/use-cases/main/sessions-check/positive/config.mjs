import jwt           from 'jsonwebtoken';
import config        from '../../../../../../lib/config.cjs';
import SessionsCheck from '../../../../../../lib/use-cases/main/sessions/Check.mjs';

export default {
    serviceClass : SessionsCheck,
    before       : async (factory) => {
        await factory.standardSetup();
        const users = await factory.setupUsers();
        const tokens = {};

        for (const user of users) {
            tokens[user.email] = jwt.sign({ id: user.id }, config.secret);
        }

        return tokens;
    }
};

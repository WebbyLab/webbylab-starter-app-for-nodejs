// import { inspect } from 'util';
import cors         from 'cors';

export default {
    cors    : cors({ origin: '*' }), // We allow any origin because we DO NOT USE cookies and basic auth
    include : (req, res, next) => {
        const { query } = req;

        if (query.include) {
            query.include = query.include.split(',');
        }

        return next();
    }
};

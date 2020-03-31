import cors       from 'cors';
import bodyParser from 'body-parser';
import busboy     from 'connect-busboy';

export default {
    json : bodyParser.json({ limit  : 1024 * 1024,
        verify : (req, res, buf) => {
            try {
                JSON.parse(buf);
            } catch (e) {
                res.send({
                    status : 0,
                    error  : {
                        code    : 'BROKEN_JSON',
                        message : 'Please, verify your json'
                    }
                });
                throw new Error('BROKEN_JSON');
            }
        }
    }),
    urlencoded : bodyParser.urlencoded({ extended: true }),
    cors       : cors({ origin: '*' }), // We allow any origin because we DO NOT USE cookies and basic auth
    // multipart  : multipart(),
    include    : (req, res, next) => {
        const { query } = req;

        if (query.include) {
            query.include = query.include.split(',');
        }

        return next();
    },
    busboy : busboy()
};

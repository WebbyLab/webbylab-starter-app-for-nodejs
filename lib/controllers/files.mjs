/* istanbul ignore file */
import chista from '../chista.mjs';
import Upload from '../services/files/Create.mjs';

export default {
    create(req, res) {
        try {
            req.busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
                const promise = chista.runService(Upload, { params : {
                    ...req.params,
                    filename,
                    encoding,
                    file,
                    mimetype
                } });

                chista.renderPromiseAsJson(req, res, promise);
            });

            req.pipe(req.busboy);
        } catch (error) {
            console.error(error);
            res.send({
                status : 0,
                error  : {
                    code    : 'UPLOAD_FAILED',
                    message : error.message
                }
            });
        }
    }
};

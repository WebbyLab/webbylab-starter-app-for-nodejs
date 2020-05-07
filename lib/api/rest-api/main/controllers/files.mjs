import chista from '../../chista.mjs';
import Upload from '../../../../use-cases/main/files/Create.mjs';

export default {
    create(req, res) {
        try {
            req.busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
                const promise = chista.runUseCase(Upload, { params : {
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

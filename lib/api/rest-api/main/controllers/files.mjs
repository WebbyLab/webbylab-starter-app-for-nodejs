import chista from '../../chista.mjs';
import Upload from '../../../../use-cases/main/files/Create.mjs';

export default {
    async create(req, res) {
        try {
            const data = await req.file();

            const promise = chista.runUseCase(Upload, { params : {
                ...req.params,
                ...data,
                file : await data.toBuffer()
            } });

            return chista.renderPromiseAsJson(req, res, promise);
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

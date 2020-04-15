import { Exception } from '../../packages.mjs';
import chista        from '../chista.mjs';

export async function runService(useCaseClass, { context = {}, params = {}, logger = chista.defaultLogger }) {
    function logRequest(type, result, startTime) {
        logger(type, {
            useCase : useCaseClass.name,
            runtime : Date.now() - startTime,
            params,
            result
        });
    }

    const startTime = Date.now();

    try {
        const result = await new useCaseClass({ context }).run(params);

        logRequest('info', result, startTime);

        return result;
    } catch (error) {
        const type = error instanceof Exception ? 'warn' : 'error';

        logRequest(type, error, startTime);

        throw error;
    }
}

export function makeServiceRunner(
    serviceClass,
    paramsBuilder  = chista.defaultParamsBuilder,
    contextBuilder = chista.defaultContextBuilder,
    logger
) {
    return async function serviceRunner(req, res) {
        const resultPromise = runService(serviceClass, {
            // TODO: change
            logger  : logger ? logger : chista.defaultLogger,
            params  : paramsBuilder(req, res),
            context : contextBuilder(req, res)
        });

        return renderPromiseAsJson(req, res, resultPromise, logger);
    };
}

async function renderPromiseAsJson(req, res, promise, logger) {
    try {
        const data = await promise;

        data.status = 1;

        return res.send(data);
    } catch (error) {
        /* istanbul ignore next */
        if (error instanceof Exception) {
            res.send({
                status : 0,
                error  : error.toHash()
            });
        } else {
            logger(
                'error',
                {
                    'REQUEST_URL'    : req.url,
                    'REQUEST_PARAMS' : req.params,
                    'REQUEST_BODY'   : req.body,
                    'ERROR_STACK'    : error.stack
                }
            );

            res.send({
                status : 0,
                error  : {
                    code    : 'SERVER_ERROR',
                    message : 'Please, contact your system administartor!'
                }
            });
        }
    }
}

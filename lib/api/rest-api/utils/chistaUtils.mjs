import { Exception } from '../../../../packages.mjs';
import chista        from '../chista.mjs';

export async function runUseCase(useCaseClass, { context = {}, params = {}, logger = chista.defaultLogger }) {
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

export function makeUseCaseRunner(
    useCaseClass,
    paramsBuilder  = chista.defaultParamsBuilder,
    contextBuilder = chista.defaultContextBuilder,
    logger         = chista.defaultLogger
) {
    return async function useCaseRunner(req, res) {
        const resultPromise = runUseCase(useCaseClass, {
            // TODO: change
            logger,
            params  : paramsBuilder(req, res),
            context : contextBuilder(req, res)
        });

        return renderPromiseAsJson(req, res, resultPromise, logger);
    };
}

async function renderPromiseAsJson(req, res, promise, logger = chista.defaultLogger) {
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
                'fatal',
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

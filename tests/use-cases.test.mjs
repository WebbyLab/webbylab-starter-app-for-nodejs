import { getDirName } from '../lib/utils/index.mjs';
import Tester from './lib/Tester.mjs';

const t = new Tester();

const __dirname = getDirName(import.meta.url);

async function main() {
    await t.iterateInTransaction(`${__dirname}/use-cases/users-create/positive`,
        async ({ config: { serviceClass, before }, input, expected }) => {
            await before(t.factory);
            await t.testService({ serviceClass, input, expected });
        }
    );


    // function requestBuilder(input) {
    //     return {
    //         method : 'POST',
    //         url    : '/api/v1/users',
    //         body   : input
    //     };
    // }

    // await t.iterateInTransaction(`${__dirname}/use-cases/users-create/positive`,
    //     async ({ config: { before }, input, expected }) => {
    //         await before(t.factory);
    //         await t.testServiceViaRest({ requestBuilder, input, expected });
    //     }
    // );

    // await t.iterateInTransaction(`${__dirname}/use-cases/users-create/positive`,
    //     async ({ config: { serviceClass, before }, input, expected }) => {
    //         await before(t.factory);
    //         await t.testServiceViaJSONRPC({ rpcMethod: serviceClass.name, input, expected });
    //     }
    // );

    process.exit();
}

main();

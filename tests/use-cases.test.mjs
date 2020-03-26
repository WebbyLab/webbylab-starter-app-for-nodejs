import test           from 'ava';
import { getDirName } from '../lib/utils/index.mjs';
import Tester         from './lib/Tester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

const testDirs = [
    'use-cases/users-create/positive',
    'use-cases/users-create/negative'
];

for (const testDir of testDirs) {
    tester.iterateInTransaction(`${dirname}/${testDir}`,
        async ({ config: { serviceClass, before }, input, expected, exception }, t) => {
            try {
                await before(tester.factory);
                await tester.testService({ serviceClass, input, expected, exception }, t);
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        test
    );
}

// async function main() {
//     await t.iterateInTransaction(`${dirname}/use-cases/users-create/positive`,
//         async ({ config: { serviceClass, before }, input, expected }) => {
//             await before(t.factory);
//             await t.testService({ serviceClass, input, expected });
//         }
//     );


//     // function requestBuilder(input) {
//     //     return {
//     //         method : 'POST',
//     //         url    : '/api/v1/users',
//     //         body   : input
//     //     };
//     // }

//     // await t.iterateInTransaction(`${dirname}/use-cases/users-create/positive`,
//     //     async ({ config: { before }, input, expected }) => {
//     //         await before(t.factory);
//     //         await t.testServiceViaRest({ requestBuilder, input, expected });
//     //     }
//     // );

//     // await t.iterateInTransaction(`${dirname}/use-cases/users-create/positive`,
//     //     async ({ config: { serviceClass, before }, input, expected }) => {
//     //         await before(t.factory);
//     //         await t.testServiceViaJSONRPC({ rpcMethod: serviceClass.name, input, expected });
//     //     }
//     // );

//     process.exit();
// }

// main();

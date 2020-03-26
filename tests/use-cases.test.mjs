import { getDirName } from '../lib/utils/index.mjs';
import Tester from './lib/Tester.mjs';

const t = new Tester();

const dirname = process.env.MODE === 'test' ? __dirname : getDirName(import.meta.url);

const testDirs = [
    'use-cases/users-create/positive',
    'use-cases/users-create/negative'
];

const lastTestDir = testDirs[testDirs.length - 1];

for (const testDir of testDirs) {
    t.iterateInTransaction(`${dirname}/${testDir}`,
        async ({ config: { serviceClass, before }, input, expected }) => {
            try {
                await before(t.factory);
                await t.testService({ serviceClass, input, expected });
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        testDir === lastTestDir
    );
}

// async function main() {
//     await t.iterateInTransaction(`${__dirname}/use-cases/users-create/positive`,
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

//     // await t.iterateInTransaction(`${__dirname}/use-cases/users-create/positive`,
//     //     async ({ config: { before }, input, expected }) => {
//     //         await before(t.factory);
//     //         await t.testServiceViaRest({ requestBuilder, input, expected });
//     //     }
//     // );

//     // await t.iterateInTransaction(`${__dirname}/use-cases/users-create/positive`,
//     //     async ({ config: { serviceClass, before }, input, expected }) => {
//     //         await before(t.factory);
//     //         await t.testServiceViaJSONRPC({ rpcMethod: serviceClass.name, input, expected });
//     //     }
//     // );

//     process.exit();
// }

// main();

import { getDirName } from '../../lib/utils/index.mjs';
import Tester         from '../lib/Tester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

tester.setupTestsWithTransactions(`${dirname}/../fixtures/use-cases/users-create/positive`,
    async ({ config: { serviceClass, before }, input, expected }) => {
        await before(tester.factory);
        await tester.testUseCasePositive({ serviceClass, input, expected });
    }
);

tester.setupTestsWithTransactions(`${dirname}/../fixtures/use-cases/users-create/negative`,
    async ({ config: { serviceClass, before }, input, exception }, assert) => {
        await before(tester.factory);
        await tester.testUseCaseNegative({ serviceClass, input, exception }, assert);
    }
);

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

import { getDirName } from '../../../lib/utils/index.mjs';
import Tester         from './Tester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

function requestBuilder(input) {
    return {
        method : 'POST',
        url    : '/api/v1/users/resetPassword',
        body   : input
    };
}

tester.setupTestsWithTransactions(`${dirname}/../../fixtures/use-cases/users-reset-password/positive`,
    'users-reset-password/positive',
    async ({ config: { before }, expected, input, checkSideEffects }) => {
        await before(tester.factory);
        await tester.testUseCasePositive({ requestBuilder, input, expected });
        await checkSideEffects({ email: input.data.email });
    }
);

tester.setupTestsWithTransactions(`${dirname}/../../fixtures/use-cases/users-reset-password/negative`,
    'users-reset-password/negative',
    async ({ config: { before }, input, exception }) => {
        await before(tester.factory);
        await tester.testUseCaseNegative({ requestBuilder, input, exception });
    }
);

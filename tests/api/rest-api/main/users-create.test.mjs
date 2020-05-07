import { getDirName } from '../../../../lib/utils/index.mjs';
import Tester         from '../../../lib/RestAPITester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

function requestBuilder(input) {
    return {
        method : 'POST',
        url    : '/api/v1/users',
        body   : input
    };
}

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/main/users-create/positive`,
    'users-create/positive',
    async ({ config: { before }, input, expected, checkSideEffects }) => {
        await before(tester.factory);
        const result = await tester.testUseCasePositive({ requestBuilder, input, expected });

        await checkSideEffects({ userId: result.data.id });
    }
);

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/main/users-create/negative`,
    'users-create/negative',
    async ({ config: { before }, input, exception }) => {
        await before(tester.factory);
        await tester.testUseCaseNegative({ requestBuilder, input, exception });
    }
);

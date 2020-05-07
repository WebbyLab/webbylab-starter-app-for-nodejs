import { getDirName } from '../../../../lib/utils/index.mjs';
import Tester         from '../../../lib/RestAPITester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

function requestBuilder(input, actionId) {
    return {
        method : 'POST',
        url    : `/api/v1/actions/${actionId}`,
        body   : input
    };
}

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/main/actions-submit/positive`,
    'actions-submit/positive',
    async ({ config: { before }, input, expected, checkSideEffects }) => {
        const { actionId, ...other } = await before(tester.factory);

        await tester.testUseCasePositive({
            requestBuilder : (...args) => requestBuilder(...args, actionId),
            input,
            expected
        });
        await checkSideEffects({ actionId, ...other });
    }
);

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/main/actions-submit/negative`,
    'actions-submit/negative',
    async ({ config: { before }, input, exception }) => {
        const { actionId } = await before(tester.factory);

        await tester.testUseCaseNegative({
            requestBuilder : (...args) => requestBuilder(...args, actionId),
            input,
            exception
        });
    }
);

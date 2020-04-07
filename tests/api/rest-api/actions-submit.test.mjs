import { getDirName } from '../../../lib/utils/index.mjs';
import Tester         from './Tester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

function requestBuilder(input, actionId) {
    return {
        method : 'POST',
        url    : `/api/v1/actions/${actionId}`,
        body   : input
    };
}

tester.setupTestsWithTransactions(`${dirname}/../../fixtures/use-cases/actions-submit/positive`,
    'actions-submit/positive',
    async ({ config: { before }, input, expected }) => {
        const actions = await before(tester.factory);
        const { type, data } = input;
        const actionId = actions[type];

        await tester.testUseCasePositive({
            requestBuilder : (...args) => requestBuilder(...args, actionId),
            input          : { data },
            expected
        });
    }
);

tester.setupTestsWithTransactions(`${dirname}/../../fixtures/use-cases/actions-submit/negative`,
    'actions-submit/negative',
    async ({ config: { before }, input, exception }) => {
        await before(tester.factory);

        const { id, ...data } = input;

        await tester.testUseCaseNegative({
            requestBuilder : (...args) => requestBuilder(...args, id),
            input          : data,
            exception
        });
    }
);

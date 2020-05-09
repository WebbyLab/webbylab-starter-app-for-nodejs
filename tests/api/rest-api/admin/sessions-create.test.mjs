import { getDirName } from '../../../../lib/utils/index.mjs';
import Tester         from '../../../lib/RestAPITester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

function requestBuilder(input) {
    return {
        method : 'POST',
        url    : '/api/v1/admin/sessions',
        body   : input
    };
}

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/admin/sessions-create/positive`,
    'admin/sessions-create/positive',
    async ({ config: { before }, input, expected }) => {
        await before(tester.factory);
        await tester.testUseCasePositive({ requestBuilder, input, expected });
    }
);

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/admin/sessions-create/negative`,
    'admin/sessions-create/negative',
    async ({ config: { before }, input, exception }) => {
        await before(tester.factory);
        await tester.testUseCaseNegative({ requestBuilder, input, exception });
    }
);

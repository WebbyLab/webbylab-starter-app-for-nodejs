import { getDirName } from '../../../../lib/utils/index.mjs';
import Tester         from '../../../lib/RestAPITester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

function requestBuilder(token) {
    return {
        method  : 'GET',
        url     : '/api/v1/users',
        headers : {
            'Authorization' : token
        }
    };
}

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/main/sessions-check/negative`,
    'sessions-check/negative',
    async ({ config: { before }, input, exception }) => {
        const tokens = await before(tester.factory);
        const token = tokens[input.email];

        await tester.testUseCaseNegative({
            requestBuilder : () => requestBuilder(token),
            exception
        });
    }
);

import { generateToken } from '../../../../lib/use-cases/utils/jwtUtils.mjs';
import { getDirName }    from '../../../../lib/utils/index.mjs';
import Tester            from '../../../lib/RestAPITester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

function requestBuilder(input, userId, token) {
    return {
        method  : 'PUT',
        url     : `/api/v1/users/${userId}`,
        body    : input,
        headers : {
            'Authorization' : token
        }
    };
}

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/main/users-update/positive`,
    'users-update/positive',
    async ({ config: { before }, expected, input }) => {
        const userId = await before(tester.factory);
        const accessToken = generateToken({ id: userId });

        await tester.testUseCasePositive({
            requestBuilder : (...args) => requestBuilder(...args, userId, accessToken),
            input,
            expected
        });
    }
);

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/main/users-update/negative`,
    'users-update/negative',
    async ({ config: { before }, input, exception }) => {
        const userId = await before(tester.factory);
        const accessToken = generateToken({ id: userId });

        await tester.testUseCaseNegative({
            requestBuilder : (...args) => requestBuilder(...args, input.id, accessToken),
            input,
            exception
        });
    }
);

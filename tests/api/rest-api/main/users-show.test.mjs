import { generateToken } from '../../../../lib/use-cases/utils/jwtUtils.mjs';
import { getDirName }    from '../../../../lib/utils/index.mjs';
import Tester            from '../../../lib/RestAPITester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

function requestBuilder(userId, token) {
    return {
        method  : 'GET',
        url     : `/api/v1/users/${userId}`,
        headers : {
            'Authorization' : token
        }
    };
}

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/main/users-show/positive`,
    'users-show/positive',
    async ({ config: { before }, expected }) => {
        const userId = await before(tester.factory);
        const accessToken = generateToken({ id: userId });

        await tester.testUseCasePositive({
            requestBuilder : () => requestBuilder(userId, accessToken),
            expected
        });
    }
);

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/main/users-show/negative`,
    'users-show/negative',
    async ({ config: { before }, input, exception }) => {
        const userId = await before(tester.factory);
        const accessToken = generateToken({ id: userId });

        await tester.testUseCaseNegative({
            requestBuilder : () => requestBuilder(input.id, accessToken),
            exception
        });
    }
);

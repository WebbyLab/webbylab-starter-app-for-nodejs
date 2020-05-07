import { generateToken } from '../../../../lib/use-cases/utils/jwtUtils.mjs';
import { getDirName }    from '../../../../lib/utils/index.mjs';
import Tester            from '../../../lib/RestAPITester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

function requestBuilder(userId, token) {
    return {
        method  : 'GET',
        url     : `/api/v1/admin/users/${userId}/resetPassword`,
        headers : {
            'Authorization' : token
        }
    };
}

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/admin/users-reset-password/positive`,
    'admin/users-reset-password/positive',
    async ({ config: { before }, expected, checkSideEffects }) => {
        const { userId, adminId } = await before(tester.factory);
        const accessToken = generateToken({ id: adminId });

        await tester.testUseCasePositive({
            requestBuilder : () => requestBuilder(userId, accessToken),
            expected
        });

        await checkSideEffects({ userId });
    }
);

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/admin/users-reset-password/negative`,
    'users-reset-password/negative',
    async ({ config: { before }, input = {}, exception }) => {
        const { userId, adminId } = await before(tester.factory);
        const accessToken = generateToken({ id: adminId });

        await tester.testUseCaseNegative({
            requestBuilder : () => requestBuilder(input.id ? input.id : userId, accessToken),
            exception
        });
    }
);

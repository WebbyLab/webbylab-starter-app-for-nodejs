import { generateToken } from '../../../../lib/use-cases/utils/jwtUtils.mjs';
import { getDirName }    from '../../../../lib/utils/index.mjs';
import Tester            from '../../../lib/RestAPITester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

function requestBuilder(userId, token) {
    return {
        method  : 'DELETE',
        url     : `/api/v1/admin/users/${userId}`,
        headers : {
            'Authorization' : token
        }
    };
}

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/admin/users-delete/positive`,
    'admin/users-delete/positive',
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
    `${dirname}/../../../fixtures/use-cases/admin/users-delete/negative`,
    'admin/users-delete/negative',
    async ({ config: { before }, input, exception }) => {
        const { adminId } = await before(tester.factory);
        const accessToken = generateToken({ id: adminId });

        await tester.testUseCaseNegative({
            requestBuilder : () => requestBuilder(input.id, accessToken),
            exception
        });
    }
);

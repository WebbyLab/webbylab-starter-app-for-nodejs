import { generateToken } from '../../../../lib/use-cases/utils/jwtUtils.mjs';
import { getDirName }    from '../../../../lib/utils/index.mjs';
import Tester            from '../../../lib/RestAPITester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

function requestBuilder(input, userId, token) {
    return {
        method  : 'PUT',
        url     : `/api/v1/admin/users/${userId}`,
        body    : input,
        headers : {
            'Authorization' : token
        }
    };
}

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/admin/users-update/positive`,
    'admin/users-update/positive',
    async ({ config: { before }, expected, input }) => {
        const { userId, adminId } = await before(tester.factory);
        const accessToken = generateToken({ id: adminId });

        await tester.testUseCasePositive({
            requestBuilder : (...args) => requestBuilder(...args, userId, accessToken),
            input,
            expected
        });
    }
);

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/admin/users-update/negative`,
    'admin/users-update/negative',
    async ({ config: { before }, input, exception }) => {
        const { adminId } = await before(tester.factory);
        const accessToken = generateToken({ id: adminId });

        await tester.testUseCaseNegative({
            requestBuilder : (...args) => requestBuilder(...args, input.id, accessToken),
            exception
        });
    }
);

import { generateToken } from '../../../../lib/use-cases/utils/jwtUtils.mjs';
import { getDirName }    from '../../../../lib/utils/index.mjs';
import Tester            from '../../../lib/RestAPITester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

function requestBuilder(input, token) {
    return {
        method  : 'POST',
        url     : '/api/v1/admin/users',
        body    : input,
        headers : {
            'Authorization' : token
        }
    };
}

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/admin/users-create/positive`,
    'admin/users-create/positive',
    async ({ config: { before }, input, expected, checkSideEffects }) => {
        const adminId = await before(tester.factory);
        const accessToken = generateToken({ id: adminId });

        const result = await tester.testUseCasePositive({
            requestBuilder : (...args) => requestBuilder(...args, accessToken),
            input,
            expected
        });

        await checkSideEffects({ userId: result.data.id });
    }
);

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/admin/users-create/negative`,
    'admin/users-create/negative',
    async ({ config: { before }, input, exception }) => {
        const adminId = await before(tester.factory);
        const accessToken = generateToken({ id: adminId });

        await tester.testUseCaseNegative({
            requestBuilder : (...args) => requestBuilder(...args, accessToken),
            input,
            exception
        });
    }
);

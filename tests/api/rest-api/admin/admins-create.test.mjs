import { generateToken } from '../../../../lib/use-cases/utils/jwtUtils.mjs';
import { getDirName }    from '../../../../lib/utils/index.mjs';
import Tester            from '../../../lib/RestAPITester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

function requestBuilder(input, token) {
    return {
        method  : 'POST',
        url     : '/api/v1/admin/admins',
        body    : input,
        headers : {
            'Authorization' : token
        }
    };
}

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/admin/admins-create/positive`,
    'admin/admins-create/positive',
    async ({ config: { before }, input, expected }) => {
        const adminId = await before(tester.factory);
        const accessToken = generateToken({ id: adminId });

        await tester.testUseCasePositive({
            requestBuilder : (...args) => requestBuilder(...args, accessToken),
            input,
            expected
        });
    }
);

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/admin/admins-create/negative`,
    'admin/admins-create/negative',
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

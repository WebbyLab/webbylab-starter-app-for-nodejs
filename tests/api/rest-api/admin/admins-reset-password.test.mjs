import jwt            from 'jsonwebtoken';
import config         from '../../../../lib/config.cjs';
import { getDirName } from '../../../../lib/utils/index.mjs';
import Tester         from '../Tester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

function requestBuilder(adminId, token) {
    return {
        method  : 'GET',
        url     : `/api/v1/admin/admins/${adminId}/resetPassword`,
        headers : {
            'Authorization' : token
        }
    };
}

tester.setupTestsWithTransactions(`${dirname}/../../../fixtures/use-cases/admin/admins-reset-password/positive`,
    'admin/admins-reset-password/positive',
    async ({ config: { before }, expected, checkSideEffects }) => {
        const adminId = await before(tester.factory);
        const accessToken = jwt.sign({ id: adminId }, config.secret);

        await tester.testUseCasePositive({
            requestBuilder : () => requestBuilder(adminId, accessToken),
            expected
        });

        await checkSideEffects({ adminId });
    }
);

tester.setupTestsWithTransactions(`${dirname}/../../../fixtures/use-cases/admin/admins-reset-password/negative`,
    'admin/admins-reset-password/negative',
    async ({ config: { before }, input, exception }) => {
        const adminId = await before(tester.factory);
        const accessToken = jwt.sign({ id: adminId }, config.secret);

        await tester.testUseCaseNegative({
            requestBuilder : () => requestBuilder(input.id, accessToken),
            exception
        });
    }
);

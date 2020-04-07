import jwt            from 'jsonwebtoken';
import config         from '../../../../lib/config.cjs';
import { getDirName } from '../../../../lib/utils/index.mjs';
import Tester         from '../Tester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

function requestBuilder(adminId, token) {
    return {
        method  : 'GET',
        url     : `/api/v1/admin/admins/${adminId}`,
        headers : {
            'Authorization' : token
        }
    };
}

tester.setupTestsWithTransactions(`${dirname}/../../../fixtures/use-cases/admin/admins-show/positive`,
    'admin/admins-show/positive',
    async ({ config: { before }, expected }) => {
        const adminId = await before(tester.factory);
        const accessToken = jwt.sign({ id: adminId }, config.secret);

        await tester.testUseCasePositive({
            requestBuilder : () => requestBuilder(adminId, accessToken),
            expected
        });
    }
);

tester.setupTestsWithTransactions(`${dirname}/../../../fixtures/use-cases/admin/admins-show/negative`,
    'admin/admins-show/negative',
    async ({ config: { before }, input, exception }) => {
        const adminId = await before(tester.factory);
        const accessToken = jwt.sign({ id: adminId }, config.secret);

        await tester.testUseCaseNegative({
            requestBuilder : () => requestBuilder(input.id, accessToken),
            exception
        });
    }
);

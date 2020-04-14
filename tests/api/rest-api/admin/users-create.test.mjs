import jwt            from 'jsonwebtoken';
import config         from '../../../../lib/config.cjs';
import { getDirName } from '../../../../lib/utils/index.mjs';
import Tester         from '../Tester.mjs';

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

tester.setupTestsWithTransactions(`${dirname}/../../../fixtures/use-cases/admin/users-create/positive`,
    'admin/users-create/positive',
    async ({ config: { before }, input, expected, checkSideEffects }) => {
        const adminId = await before(tester.factory);
        const accessToken = jwt.sign({ id: adminId }, config.secret);

        const result = await tester.testUseCasePositive({
            requestBuilder : (...args) => requestBuilder(...args, accessToken),
            input,
            expected
        });

        await checkSideEffects({ userId: result.data.id });
    }
);

tester.setupTestsWithTransactions(`${dirname}/../../../fixtures/use-cases/admin/users-create/negative`,
    'admin/users-create/negative',
    async ({ config: { before }, input, exception }) => {
        const adminId = await before(tester.factory);
        const accessToken = jwt.sign({ id: adminId }, config.secret);

        await tester.testUseCaseNegative({
            requestBuilder : (...args) => requestBuilder(...args, accessToken),
            input,
            exception
        });
    }
);

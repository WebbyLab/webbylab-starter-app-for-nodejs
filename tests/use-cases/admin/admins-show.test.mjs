import { getDirName } from '../../../lib/utils/index.mjs';
import Tester         from '../../lib/UseCaseTester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

tester.setupTestsWithTransactions(`${dirname}/../../fixtures/use-cases/admin/admins-show/positive`,
    'admin/admins-show/positive',
    async ({ config: { serviceClass, before }, expected }) => {
        const adminId = await before(tester.factory);

        await tester.testUseCasePositive({ serviceClass, input: { id: adminId }, expected });
    }
);

tester.setupTestsWithTransactions(`${dirname}/../../fixtures/use-cases/admin/admins-show/negative`,
    'admin/admins-show/negative',
    async ({ config: { serviceClass, before }, input, exception }) => {
        await before(tester.factory);
        await tester.testUseCaseNegative({ serviceClass, input, exception });
    }
);

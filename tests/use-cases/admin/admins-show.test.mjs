import { getDirName } from '../../../lib/utils/index.mjs';
import Tester         from '../../lib/UseCaseTester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

tester.setupTestsWithTransactions(
    `${dirname}/../../fixtures/use-cases/admin/admins-show/positive`,
    'admin/admins-show/positive',
    async ({ config: { useCaseClass, before }, expected }) => {
        const adminId = await before(tester.factory);

        await tester.testUseCasePositive({ useCaseClass, input: { id: adminId }, expected });
    }
);

tester.setupTestsWithTransactions(
    `${dirname}/../../fixtures/use-cases/admin/admins-show/negative`,
    'admin/admins-show/negative',
    async ({ config: { useCaseClass, before }, input, exception }) => {
        await before(tester.factory);
        await tester.testUseCaseNegative({ useCaseClass, input, exception });
    }
);

import { getDirName } from '../../../lib/utils/index.mjs';
import Tester         from '../../lib/UseCaseTester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

tester.setupTestsWithTransactions(
    `${dirname}/../../fixtures/use-cases/admin/admins-reset-password/positive`,
    'admin/admins-reset-password/positive',
    async ({ config: { useCaseClass, before }, expected, checkSideEffects }) => {
        const adminId = await before(tester.factory);

        await tester.testUseCasePositive({ useCaseClass, input: { id: adminId }, expected });

        await checkSideEffects({ adminId });
    }
);

tester.setupTestsWithTransactions(
    `${dirname}/../../fixtures/use-cases/admin/admins-reset-password/negative`,
    'admin/admins-reset-password/negative',
    async ({ config: { useCaseClass, before }, input, exception }) => {
        await before(tester.factory);
        await tester.testUseCaseNegative({ useCaseClass, input, exception });
    }
);

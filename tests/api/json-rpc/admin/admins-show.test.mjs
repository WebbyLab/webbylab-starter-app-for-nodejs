import { getDirName } from '../../../../lib/utils/index.mjs';
import Tester         from '../../../lib/JsonRPCTester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/admin/admins-show/positive`,
    'admin/admins-show/positive',
    async ({ config: { useCaseClass, before }, expected }) => {
        const adminId = await before(tester.factory);

        await tester.testUseCasePositive({ method: useCaseClass.name, input: { id: adminId }, expected });
    }
);

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/admin/admins-show/negative`,
    'admin/admins-show/negative',
    async ({ config: { useCaseClass, before }, input, exception }) => {
        await before(tester.factory);
        await tester.testUseCaseNegative({ method: useCaseClass.name, input, exception });
    }
);

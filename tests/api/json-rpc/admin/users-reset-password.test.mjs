import { getDirName } from '../../../../lib/utils/index.mjs';
import Tester         from '../../../lib/JsonRPCTester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/admin/users-reset-password/positive`,
    'admin/users-reset-password/positive',
    async ({ config: { useCaseClass, before }, expected, checkSideEffects }) => {
        const { userId } = await before(tester.factory);

        await tester.testUseCasePositive({ method: useCaseClass.name, input: { id: userId }, expected });
        await checkSideEffects({ userId });
    }
);

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/admin/users-reset-password/negative`,
    'users-reset-password/negative',
    async ({ config: { useCaseClass, before }, input = {}, exception }) => {
        const { userId } = await before(tester.factory);

        await tester.testUseCaseNegative({ method: useCaseClass.name, input: { id: userId, ...input }, exception });
    }
);

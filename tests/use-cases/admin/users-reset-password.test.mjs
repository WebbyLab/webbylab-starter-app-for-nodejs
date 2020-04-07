import { getDirName } from '../../../lib/utils/index.mjs';
import Tester         from '../Tester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

tester.setupTestsWithTransactions(`${dirname}/../../fixtures/use-cases/admin/users-reset-password/positive`,
    'admin/users-reset-password/positive',
    async ({ config: { serviceClass, before }, expected, checkSideEffects }) => {
        const { userId } = await before(tester.factory);

        await tester.testUseCasePositive({ serviceClass, input: { id: userId }, expected });
        await checkSideEffects({ userId });
    }
);

tester.setupTestsWithTransactions(`${dirname}/../../fixtures/use-cases/admin/users-reset-password/negative`,
    'users-reset-password/negative',
    async ({ config: { serviceClass, before }, input = {}, exception }) => {
        const { userId } = await before(tester.factory);

        await tester.testUseCaseNegative({ serviceClass, input: { id: userId, ...input }, exception });
    }
);

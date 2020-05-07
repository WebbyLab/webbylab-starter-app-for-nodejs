import { getDirName } from '../../../lib/utils/index.mjs';
import Tester         from '../../lib/UseCaseTester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

tester.setupTestsWithTransactions(
    `${dirname}/../../fixtures/use-cases/main/users-create/positive`,
    'users-create/positive',
    async ({ config: { useCaseClass, before }, input, expected, checkSideEffects }) => {
        await before(tester.factory);
        const result = await tester.testUseCasePositive({ useCaseClass, input, expected });

        await checkSideEffects({ userId: result.data.id });
    }
);

tester.setupTestsWithTransactions(
    `${dirname}/../../fixtures/use-cases/main/users-create/negative`,
    'users-create/negative',
    async ({ config: { useCaseClass, before }, input, exception }) => {
        await before(tester.factory);
        await tester.testUseCaseNegative({ useCaseClass, input, exception });
    }
);

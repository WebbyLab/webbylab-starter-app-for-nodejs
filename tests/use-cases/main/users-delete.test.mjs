import { getDirName } from '../../../lib/utils/index.mjs';
import Tester         from '../../lib/UseCaseTester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

tester.setupTestsWithTransactions(
    `${dirname}/../../fixtures/use-cases/main/users-delete/positive`,
    'users-delete/positive',
    async ({ config: { useCaseClass, before }, expected, checkSideEffects }) => {
        const userId = await before(tester.factory);

        await tester.testUseCasePositive({ useCaseClass, input: { id: userId }, context: { userId }, expected });

        await checkSideEffects({ userId });
    }
);

tester.setupTestsWithTransactions(
    `${dirname}/../../fixtures/use-cases/main/users-delete/negative`,
    'users-delete/negative',
    async ({ config: { useCaseClass, before }, input, exception, context }) => {
        await before(tester.factory);
        await tester.testUseCaseNegative({ useCaseClass, input, context, exception });
    }
);

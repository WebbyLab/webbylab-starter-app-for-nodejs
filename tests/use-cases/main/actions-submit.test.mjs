import { getDirName } from '../../../lib/utils/index.mjs';
import Tester         from '../../lib/UseCaseTester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

tester.setupTestsWithTransactions(
    `${dirname}/../../fixtures/use-cases/main/actions-submit/positive`,
    'actions-submit/positive',
    async ({ config: { useCaseClass, before }, input, expected, checkSideEffects }) => {
        const { actionId, ...other } = await before(tester.factory);

        await tester.testUseCasePositive({ useCaseClass, input: { ...input, id: actionId }, expected });
        await checkSideEffects({ actionId, ...other });
    }
);

tester.setupTestsWithTransactions(
    `${dirname}/../../fixtures/use-cases/main/actions-submit/negative`,
    'actions-submit/negative',
    async ({ config: { useCaseClass, before }, input, exception }) => {
        const { actionId } = await before(tester.factory);

        await tester.testUseCaseNegative({ useCaseClass, input: { id: actionId, ...input }, exception });
    }
);

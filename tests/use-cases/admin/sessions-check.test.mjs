import { getDirName } from '../../../lib/utils/index.mjs';
import Tester         from '../../lib/UseCaseTester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

tester.setupTestsWithTransactions(
    `${dirname}/../../fixtures/use-cases/admin/sessions-check/positive`,
    'admin/sessions-check/positive',
    async ({ config: { useCaseClass, before }, input, expected }) => {
        const tokens = await before(tester.factory);
        const token = tokens[input.email];

        await tester.testUseCasePositive({ useCaseClass, input: { token }, expected });
    }
);

tester.setupTestsWithTransactions(
    `${dirname}/../../fixtures/use-cases/admin/sessions-check/negative`,
    'admin/sessions-check/negative',
    async ({ config: { useCaseClass, before }, input, exception }) => {
        const tokens = await before(tester.factory);
        const token = tokens[input.email];

        await tester.testUseCaseNegative({ useCaseClass, input: { token }, exception });
    }
);

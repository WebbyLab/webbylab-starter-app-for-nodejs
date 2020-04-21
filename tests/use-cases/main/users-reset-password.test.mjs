import { getDirName } from '../../../lib/utils/index.mjs';
import Tester         from '../../lib/UseCaseTester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

tester.setupTestsWithTransactions(`${dirname}/../../fixtures/use-cases/main/users-reset-password/positive`,
    'users-reset-password/positive',
    async ({ config: { serviceClass, before }, expected, input, checkSideEffects }) => {
        await before(tester.factory);
        await tester.testUseCasePositive({ serviceClass, input, expected });
        await checkSideEffects({ email: input.data.email });
    }
);

tester.setupTestsWithTransactions(`${dirname}/../../fixtures/use-cases/main/users-reset-password/negative`,
    'users-reset-password/negative',
    async ({ config: { serviceClass, before }, input, exception }) => {
        await before(tester.factory);
        await tester.testUseCaseNegative({ serviceClass, input, exception });
    }
);

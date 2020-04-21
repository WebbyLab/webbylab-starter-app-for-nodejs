import { getDirName } from '../../../lib/utils/index.mjs';
import Tester         from '../../lib/UseCaseTester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

tester.setupTestsWithTransactions(`${dirname}/../../fixtures/use-cases/main/users-show/positive`,
    'users-show/positive',
    async ({ config: { serviceClass, before }, expected }) => {
        const userId = await before(tester.factory);

        await tester.testUseCasePositive({ serviceClass, input: { id: userId }, context: { userId }, expected });
    }
);

tester.setupTestsWithTransactions(`${dirname}/../../fixtures/use-cases/main/users-show/negative`,
    'users-show/negative',
    async ({ config: { serviceClass, before }, input, exception, context }) => {
        await before(tester.factory);
        await tester.testUseCaseNegative({ serviceClass, input,  exception, context });
    }
);

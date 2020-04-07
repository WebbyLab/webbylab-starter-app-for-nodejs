import { getDirName } from '../../lib/utils/index.mjs';
import Tester         from './Tester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

tester.setupTestsWithTransactions(`${dirname}/../fixtures/use-cases/users-reset-password/positive`,
    'users-reset-password/positive',
    async ({ config: { serviceClass, before }, expected, input, checkSideEffects }) => {
        await before(tester.factory);
        await tester.testUseCasePositive({ serviceClass, input, expected });
        await checkSideEffects();
    }
);

tester.setupTestsWithTransactions(`${dirname}/../fixtures/use-cases/users-reset-password/negative`,
    'users-reset-password/negative',
    async ({ config: { serviceClass, before }, input, exception }) => {
        await before(tester.factory);
        await tester.testUseCaseNegative({ serviceClass, input, exception });
    }
);

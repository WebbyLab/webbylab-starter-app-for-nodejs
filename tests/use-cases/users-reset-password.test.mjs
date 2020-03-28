import { getDirName } from '../../lib/utils/index.mjs';
import Tester         from '../lib/Tester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

tester.setupTestsWithTransactions(`${dirname}/../fixtures/use-cases/users-reset-password/positive`,
    async ({ config: { serviceClass, before }, expected, input, fetchSideEffects, expectedSideEffects }) => {
        await before(tester.factory);
        await tester.testUseCasePositive({ serviceClass, input, expected });
        await tester.testSideEffects({ fetchSideEffects, expectedSideEffects });
    }
);

tester.setupTestsWithTransactions(`${dirname}/../fixtures/use-cases/users-reset-password/negative`,
    async ({ config: { serviceClass, before }, input, exception }, assert) => {
        await before(tester.factory);
        await tester.testUseCaseNegative({ serviceClass, input, exception }, assert);
    }
);

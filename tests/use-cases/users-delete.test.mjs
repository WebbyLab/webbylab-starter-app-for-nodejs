import { getDirName } from '../../lib/utils/index.mjs';
import Tester         from '../lib/Tester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

tester.setupTestsWithTransactions(`${dirname}/../fixtures/use-cases/users-delete/positive`,
    async ({ config: { serviceClass, before }, expected, fetchSideEffects, expectedSideEffects }) => {
        const userId = await before(tester.factory);

        await tester.testUseCasePositive({ serviceClass, input: { id: userId }, expected });

        await tester.testSideEffects({ fetchSideEffects, expectedSideEffects, input: { userId } });
    }
);

tester.setupTestsWithTransactions(`${dirname}/../fixtures/use-cases/users-delete/negative`,
    async ({ config: { serviceClass, before }, input, exception }, assert) => {
        await before(tester.factory);
        await tester.testUseCaseNegative({ serviceClass, input, exception }, assert);
    }
);

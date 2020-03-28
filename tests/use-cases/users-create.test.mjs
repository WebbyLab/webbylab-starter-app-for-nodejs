import { getDirName } from '../../lib/utils/index.mjs';
import Tester         from '../lib/Tester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

tester.setupTestsWithTransactions(`${dirname}/../fixtures/use-cases/users-create/positive`,
    async ({ config: { serviceClass, before }, input, expected, expectedSideEffects, fetchSideEffects }) => {
        await before(tester.factory);
        const result = await tester.testUseCasePositive({ serviceClass, input, expected });

        await tester.testSideEffects({ fetchSideEffects, expectedSideEffects, input: { userId: result.data.id } });
    }
);

tester.setupTestsWithTransactions(`${dirname}/../fixtures/use-cases/users-create/negative`,
    async ({ config: { serviceClass, before }, input, exception }, assert) => {
        await before(tester.factory);
        await tester.testUseCaseNegative({ serviceClass, input, exception }, assert);
    }
);

import { getDirName } from '../../lib/utils/index.mjs';
import Tester         from '../lib/Tester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

tester.setupTestsWithTransactions(`${dirname}/../fixtures/use-cases/users-delete/positive`,
    async ({ config: { serviceClass, before }, expected, checkSideEffects }) => {
        const userId = await before(tester.factory);

        await tester.testUseCasePositive({ serviceClass, input: { id: userId }, context: { userId }, expected });

        await checkSideEffects({ userId });
    }
);

tester.setupTestsWithTransactions(`${dirname}/../fixtures/use-cases/users-delete/negative`,
    async ({ config: { serviceClass, before }, input, exception }) => {
        await before(tester.factory);
        await tester.testUseCaseNegative({ serviceClass, input, exception });
    }
);

import { getDirName } from '../../lib/utils/index.mjs';
import Tester         from '../lib/Tester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

tester.setupTestsWithTransactions(`${dirname}/../fixtures/use-cases/users-update/positive`,
    async ({ config: { serviceClass, before }, expected, input }) => {
        const userId = await before(tester.factory);

        await tester.testUseCasePositive({ serviceClass, input: { ...input, id: userId }, expected });
    }
);

tester.setupTestsWithTransactions(`${dirname}/../fixtures/use-cases/users-update/negative`,
    async ({ config: { serviceClass, before }, input, exception }, assert) => {
        await before(tester.factory);
        await tester.testUseCaseNegative({ serviceClass, input, exception }, assert);
    }
);

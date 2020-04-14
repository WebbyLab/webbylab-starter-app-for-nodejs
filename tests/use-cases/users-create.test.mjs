import { getDirName } from '../../lib/utils/index.mjs';
import Tester         from './Tester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

tester.setupTestsWithTransactions(`${dirname}/../fixtures/use-cases/users-create/positive`,
    'users-create/positive',
    async ({ config: { serviceClass, before }, input, expected, checkSideEffects }) => {
        await before(tester.factory);
        const result = await tester.testUseCasePositive({ serviceClass, input, expected });

        await checkSideEffects({ userId: result.data.id });
    }
);

tester.setupTestsWithTransactions(`${dirname}/../fixtures/use-cases/users-create/negative`,
    'users-create/negative',
    async ({ config: { serviceClass, before }, input, exception }) => {
        await before(tester.factory);
        await tester.testUseCaseNegative({ serviceClass, input, exception });
    }
);

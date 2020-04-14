import { getDirName } from '../../../lib/utils/index.mjs';
import Tester         from '../Tester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

tester.setupTestsWithTransactions(`${dirname}/../../fixtures/use-cases/admin/users-update/positive`,
    'admin/users-update/positive',
    async ({ config: { serviceClass, before }, expected, input }) => {
        const { userId } = await before(tester.factory);

        await tester.testUseCasePositive({
            serviceClass,
            input : { ...input, id: userId },
            expected
        });
    }
);

tester.setupTestsWithTransactions(`${dirname}/../../fixtures/use-cases/admin/users-update/negative`,
    'admin/users-update/negative',
    async ({ config: { serviceClass, before }, input, exception }) => {
        await before(tester.factory);
        await tester.testUseCaseNegative({ serviceClass, input, exception });
    }
);

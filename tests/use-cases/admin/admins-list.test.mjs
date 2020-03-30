import { getDirName } from '../../../lib/utils/index.mjs';
import Tester         from '../../lib/Tester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

tester.setupTestsWithTransactions(`${dirname}/../../fixtures/use-cases/admin/admins-list/positive`,
    async ({ config: { serviceClass, before }, input, expected }) => {
        await before(tester.factory);
        await tester.testUseCasePositive({ serviceClass, input, expected });
    }
);

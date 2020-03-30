import { getDirName } from '../../lib/utils/index.mjs';
import Tester         from '../lib/Tester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

tester.setupTestsWithTransactions(`${dirname}/../fixtures/use-cases/sessions-create/positive`,
    async ({ config: { serviceClass, before }, input, expected }) => {
        await before(tester.factory);
        await tester.testUseCasePositive({ serviceClass, input, expected });
    }
);

tester.setupTestsWithTransactions(`${dirname}/../fixtures/use-cases/sessions-create/negative`,
    async ({ config: { serviceClass, before }, input, exception }, assert) => {
        await before(tester.factory);
        await tester.testUseCaseNegative({ serviceClass, input, exception }, assert);
    }
);

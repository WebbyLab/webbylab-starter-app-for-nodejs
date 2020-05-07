import { getDirName } from '../../../../lib/utils/index.mjs';
import Tester         from '../../../lib/JsonRPCTester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/admin/sessions-create/positive`,
    'admin/sessions-create/positive',
    async ({ config: { useCaseClass, before }, input, expected }) => {
        await before(tester.factory);
        await tester.testUseCasePositive({ method: useCaseClass.name, input, expected });
    }
);

tester.setupTestsWithTransactions(
    `${dirname}/../../../fixtures/use-cases/admin/sessions-create/negative`,
    'admin/sessions-create/negative',
    async ({ config: { useCaseClass, before }, input, exception }) => {
        await before(tester.factory);
        await tester.testUseCaseNegative({ method: useCaseClass.name, input, exception });
    }
);

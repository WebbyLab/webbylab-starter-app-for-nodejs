import { getDirName } from '../../lib/utils/index.mjs';
import Tester         from '../lib/Tester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

tester.setupTestsWithTransactions(`${dirname}/../fixtures/use-cases/sessions-check/positive`,
    async ({ config: { serviceClass, before }, input, expected }) => {
        const tokens = await before(tester.factory);
        const token = tokens[input.email];

        await tester.testUseCasePositive({ serviceClass, input: { token }, expected });
    }
);

tester.setupTestsWithTransactions(`${dirname}/../fixtures/use-cases/sessions-check/negative`,
    async ({ config: { serviceClass, before }, input, exception }) => {
        const tokens = await before(tester.factory);
        const token = tokens[input.email];

        await tester.testUseCaseNegative({ serviceClass, input: { token }, exception });
    }
);

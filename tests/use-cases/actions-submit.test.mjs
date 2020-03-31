import { getDirName } from '../../lib/utils/index.mjs';
import Tester         from '../lib/Tester.mjs';

const tester = new Tester();

const dirname = getDirName(import.meta.url);

tester.setupTestsWithTransactions(`${dirname}/../fixtures/use-cases/actions-submit/positive`,
    'actions-submit/positive',
    async ({ config: { serviceClass, before }, input, expected }) => {
        const actions = await before(tester.factory);
        const { type, data } = input;
        const actionId = actions[type];

        await tester.testUseCasePositive({ serviceClass, input: { ...data, id: actionId }, expected });
    }
);

import { Exception } from '../../packages.mjs';
import Base          from './Base.mjs';

class UseCaseTester extends Base {
    async testUseCasePositive({ useCaseClass: UseCase, input = {}, expected = {}, context = {} } = {}) {
        function useCaseRunner() {
            const useCase = new UseCase({ context });

            return useCase.run(input);
        }

        return this._testUseCasePositiveAbstract({ useCaseRunner, expected });
    }

    async testUseCaseNegative({ useCaseClass: UseCase, input = {}, exception = {}, context = {} } = {}) {
        function useCaseRunner() {
            const useCase = new UseCase({ context });

            return useCase.run(input);
        }

        return this._testUseCaseNegativeAbstract({ useCaseRunner, exception });
    }

    async _testUseCaseNegativeAbstract({ useCaseRunner, exception = {} } = {}, assert = this.testContext) {
        const error = await assert.throwsAsync(
            useCaseRunner,
            { instanceOf: Exception }
        );

        assert.deepEqual(error, new Exception(exception));
    }
}

export default UseCaseTester;

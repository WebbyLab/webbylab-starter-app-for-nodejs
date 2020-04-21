import { Exception }  from '../../packages.mjs';
import AbstractTester from '../lib/AbstractTester.mjs';

class UseCaseTester extends AbstractTester {
    async testUseCasePositive({ serviceClass: Service, input = {}, expected = {}, context = {} } = {}) {
        function serviceRunner() {
            const service = new Service({ context });

            return service.run(input);
        }

        return this._testUseCasePositiveAbstract({ serviceRunner, expected });
    }

    async testUseCaseNegative({ serviceClass: Service, input = {}, exception = {}, context = {} } = {}) {
        function serviceRunner() {
            const service = new Service({ context });

            return service.run(input);
        }

        return this._testUseCaseNegativeAbstract({ serviceRunner, exception });
    }

    async _testUseCaseNegativeAbstract({ serviceRunner, exception = {} } = {}, assert = this.testContext) {
        const error = await assert.throwsAsync(
            serviceRunner,
            { instanceOf: Exception }
        );

        assert.deepEqual(error, new Exception(exception));
    }
}

export default UseCaseTester;

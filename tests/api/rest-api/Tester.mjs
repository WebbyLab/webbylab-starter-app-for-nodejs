import fetch from 'node-fetch';

import '../../../app.mjs';

import AbstractTester from '../../lib/AbstractTester.mjs';

class RestAPITester extends AbstractTester {
    constructor(...params) {
        super(...params);

        this._apiPrefix = `http://localhost:${process.env.PORT}`;
    }

    async testUseCasePositive({ requestBuilder, input = {}, expected = {} } = {}) {
        const apiPrefix = this._apiPrefix;

        async function serviceRunner() {
            const request = requestBuilder(input);
            const response = await fetch(`${apiPrefix}${request.url}`, {
                method  : request.method,
                headers : {
                    ...(request.headers || {}),
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify(request.body)
            });

            return response.json();
        }

        return this._testUseCasePositiveAbstract({
            serviceRunner,
            expected : {
                ...expected,
                status : { is: 1 }
            }
        });
    }

    async testUseCaseNegative({ requestBuilder, input = {}, exception = {} } = {}) {
        const apiPrefix = this._apiPrefix;

        async function serviceRunner() {
            const request = requestBuilder(input);
            const response = await fetch(`${apiPrefix}${request.url}`, {
                method  : request.method,
                headers : {
                    ...(request.headers || {}),
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify(request.body)
            });

            return response.json();
        }

        return this._testUseCaseNegativeAbstract({
            serviceRunner,
            exception : {
                status : 0,
                error  : exception
            }
        });
    }

    async _testUseCaseNegativeAbstract({ serviceRunner, exception = {} } = {}, assert = this.testContext) {
        const error = await serviceRunner();

        assert.deepEqual(error, exception);
    }
}

export default RestAPITester;

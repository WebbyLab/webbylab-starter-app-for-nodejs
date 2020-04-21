import fetch from 'node-fetch';


import '../../../app.mjs';
import '../../../lib/api/rest-api/app.mjs';

import AbstractTester from '../../lib/AbstractTester.mjs';

class RestAPITester extends AbstractTester {
    constructor(...params) {
        super(...params);
    }

    async testUseCasePositive({ requestBuilder, input = {}, expected = {} } = {}) {
        const apiPrefix = this._getApiPrefix();

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
        const apiPrefix = this._getApiPrefix();

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

    _getApiPrefix() {
        // global.REST_API_PORT is defined in RestAPI app.
        // TODO: better way is to import app and use server.address() to get the port
        return  `http://localhost:${global.REST_API_PORT}`;
    }
}

export default RestAPITester;

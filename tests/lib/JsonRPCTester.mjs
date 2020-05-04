import MoleClient        from 'mole-rpc/MoleClient.js';
import X                 from 'mole-rpc/X.js';
import WebSocket         from 'ws';
import TransportClientWS from 'mole-rpc-transport-ws/TransportClientWS.js';

import * as JsonRPC      from '../../lib/api/json-rpc/app.mjs';

import Base from './Base.mjs';

class JsonRPCTester extends Base {
    #ws = null;
    #rpcClient = null;

    constructor(...params) {
        super(...params);

        // TODO: check async init
        JsonRPC.start({ wssPort: '12345' });
        this.#ws = new WebSocket('ws://localhost:12345/');
        this.#rpcClient = new MoleClient({
            transport : new TransportClientWS({
                wsBuilder : () => this.#ws
            })
        });
    }

    async testUseCasePositive({ method, input = {}, expected = {}, context = {} } = {}) {
        const rpcClient = this.#rpcClient;

        if (!method) throw new Error('DEFINE METHOD');
        // TODO: remove on json rpc sessions complete
        await rpcClient.callMethod('register', [ context ]);
        async function useCaseRunner() {
            const response = await rpcClient.callMethod(method, [ input ]);

            return response;
        }

        return this._testUseCasePositiveAbstract({
            useCaseRunner,
            expected : {
                ...expected,
                status : { is: 1 }
            }
        });
    }

    async testUseCaseNegative({ method, input = {}, exception = {} } = {}) {
        const rpcClient = this.#rpcClient;

        async function useCaseRunner() {
            const response = await rpcClient.callMethod(method, [ input ]);

            return response;
        }

        return this._testUseCaseNegativeAbstract({
            useCaseRunner,
            exception
        });
    }

    async _testUseCaseNegativeAbstract({ useCaseRunner, exception = {} } = {}, assert = this.testContext) {
        const error = await assert.throwsAsync(
            useCaseRunner,
            { instanceOf: X.ExecutionError }
        );

        assert.deepEqual(error, new X.ExecutionError({ data: exception }));
    }

    // #getApiPrefix = () => {
    //     // global.REST_API_PORT is defined in RestAPI app.
    //     // TODO: better way is to import app and use server.address() to get the port
    //     return  `ws://localhost:${global.REST_API_PORT}`;
    // }
}

export default JsonRPCTester;

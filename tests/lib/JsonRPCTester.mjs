import MoleClient        from 'mole-rpc/MoleClient.js';
import X                 from 'mole-rpc/X.js';
import WebSocket         from 'ws';
import TransportClientWS from 'mole-rpc-transport-ws/TransportClientWS.js';

import * as JsonRPC      from '../../lib/api/json-rpc/app.mjs';

import Base              from './BaseTester.mjs';

class JsonRPCTester extends Base {
    #ws = null;

    #rpcClient = null;

    constructor(...params) {
        super(...params);

        const wssPort = this.#getWssPort();

        // TODO: check async init
        JsonRPC.start({ wssPort });
        this.#ws = new WebSocket(`ws://localhost:${wssPort}/`);
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

        return this.testUseCasePositiveAbstract({
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

        return this.testUseCaseNegativeAbstract({
            useCaseRunner,
            exception
        });
    }

    async testUseCaseNegativeAbstract({ useCaseRunner, exception = {} } = {}, assert = this.testContext) {
        const error = await assert.throwsAsync(
            useCaseRunner,
            { instanceOf: X.ExecutionError }
        );

        assert.deepEqual(error, new X.ExecutionError({ data: exception }));
    }

    #getWssPort = () => {
        // TODO: find a way to find free port
        // eslint-disable-next-line no-magic-numbers
        const wssPort = 10000 + Math.floor(Math.random() * 10000);

        return wssPort;
    }
}

export default JsonRPCTester;

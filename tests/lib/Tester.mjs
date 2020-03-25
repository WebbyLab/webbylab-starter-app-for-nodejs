import { promises as fs } from 'fs';
import chai         from 'chai';
import LIVR               from 'livr';
import extraRules         from 'livr-extra-rules';
// import fetch              from 'node-fetch';

// import TransportClientWS  from 'mole-rpc-transport-ws/TransportClientWS';
// import MoleClient         from 'mole-rpc/MoleClient';
// import WebSocket          from 'ws';

import initAllModels      from '../../lib/domain-model/initModels.mjs';
import appConfig          from '../../lib/config.cjs';
// import app                from '../../app';
// import rpcApp             from '../../lib/json-rpc/app';
import TestFactory        from './TestFactory.mjs';

// const WSS_PORT = 12345;

const assert = chai.assert;

class Tester {
    constructor() {
        const { sequelize } = initAllModels(appConfig['test-db']);

        global.sequelize = sequelize; // TODO find a better way

        this.sequelize = sequelize;
        this.factory = new TestFactory();
        // this.app = app;
        // this.rpcApp = rpcApp;

        // this.moleClient = new MoleClient({
        //     requestTimeout : 1000,
        //     transport      : new TransportClientWS({
        //         wsBuilder : () => new WebSocket(`ws://localhost:${WSS_PORT}`)
        //     })
        // });
    }

    async iterateTestData(rootDir, cb) {
        const items = await fs.readdir(rootDir, { withFileTypes: true });
        const dirs = items.filter(f => f.isDirectory()).map(f => f.name);
        const rootFiles = items.filter(f => f.isFile()).map(f => f.name);

        const rootData = {};

        for (const file of rootFiles) {
            const key = file.replace(/\..+$/, '');

            rootData[key] = await import(`${rootDir}/${file}`);

            // TODO: change. Used for JSON imports and default exports
            if (rootData[key].default) {
                rootData[key] = rootData[key].default;
            }
        }

        for (const dir of dirs) {
            const files = (await fs.readdir(`${rootDir}/${dir}`, { withFileTypes: true }))
                .filter(f => f.isFile())
                .map(f => f.name);

            const data = {};

            for (const file of files) {
                const key = file.replace(/\..+$/, '');

                data[key] = await import(`${rootDir}/${dir}/${file}`);

                // TODO: change. Used for JSON imports and default exports
                if (data[key].default) {
                    data[key] = data[key].default;
                }
            }

            await cb({...rootData, ...data}); // eslint-disable-line
        }
    }

    async iterateInTransaction(rootDir, cb) {
        await this.iterateTestData(rootDir, async data => {
            await this.sequelize.transaction(async t1 => {
                global.testTransaction = t1;

                await cb(data); // eslint-disable-line
                global.withTestTransaction = null;
                await t1.rollback();
            }).catch(error => {
                if (!error.message.match(/rollback/)) {
                    console.log(error);
                }
            });
        });
    }

    async testService({ serviceClass: Service, input = {}, expected = {} } = {}) {
        function serviceRunner() {
            const service = new Service({ context: {} });

            return service.run(input);
        }

        await this._testServiceAbstract({ serviceRunner, expected });
    }

    // async testServiceViaRest({ requestBuilder, input = {}, expected = {} } = {}) {
    //     async function serviceRunner() {
    //         const request = requestBuilder(input);
    //         const apiPrefix = 'http://localhost:8000';
    //         const response = await fetch(`${apiPrefix}${request.url}`, {
    //             method  : request.method,
    //             headers : {
    //                 'Content-Type' : 'application/json'
    //             },
    //             body : JSON.stringify(request.body)
    //         });

    //         console.log(response);

    //         return response.json();
    //     }

    //     await this._testServiceAbstract({ serviceRunner, expected });
    // }

    // async testServiceViaJSONRPC({ rpcMethod, input = {}, expected = {} } = {}) {
    //     const serviceRunner = () => {
    //         return this.moleClient.callMethod(rpcMethod, [ input ]);
    //     };

    //     await this._testServiceAbstract({ serviceRunner, expected });
    // }


    async _testServiceAbstract({ serviceRunner, expected = {} } = {}) {
        try {
            const got = await serviceRunner();

            console.log('GOT', got);
            console.log('EXPECTED', expected);

            const validator = new LIVR.Validator(expected);

            validator.registerRules(extraRules);
            validator.prepare();

            const validated = validator.validate(got);

            if (!validator.validate(got)) {
                throw new Error(JSON.stringify({
                    got,
                    errors : validator.getErrors()
                }, null, 4));
            }

            console.log('VALIDATED', validated);

            // For strict equality
            delete got.status; // TODO: remove this dirty hack
            assert.deepEqual(got, validated);

            // assert.deepInclude(got.data, expected.data);
        } catch (error) {
            console.log('ERROR');
            console.log('error', error);
        }
    }
}


export default Tester;

import MoleServer         from 'mole-rpc/MoleServer.js';
import WebSocket          from 'ws';

import clsNamespace       from '../../clsNamespace.mjs';
import logger             from '../logger.mjs';

import TransportServerWSS from './TransportServerWS.mjs';
import connectionsPool    from './connectionsPool.mjs';
import * as chista        from './chista.mjs';

import mainMethods        from './main/index.mjs';
import adminMethods       from './admin/index.mjs';

let server = null;

export async function start({ wssPort }) {
    server = new MoleServer({ transports: prepareTransports({ wssPort }) });
    server.expose({
        ...mainMethods,
        ...adminMethods,
        // TODO: remove on json rpc sessions complete
        register : (data) => {
            const ws = clsNamespace.get('ws');

            connectionsPool.add(ws, data);
        }
    });

    logger.info(`[JsonRpcApp] STARTING AT PORT [${wssPort}] (via WS)`);
    await server.run();

    // TODO: remove on json rpc sessions complete
    chista.setContextBuilder(() => {
        const ws = clsNamespace.get('ws');

        return connectionsPool.get(ws);
    });
}

export async function stop() {
    if (!server) return;
    // TODO: terminate wss
}

function prepareTransports({ wssPort }) {
    return [
        new TransportServerWSS({
            wss : new WebSocket.Server({
                port : wssPort
            })
        })
    ];
}


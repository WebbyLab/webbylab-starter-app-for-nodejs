import MoleServer         from 'mole-rpc/MoleServer.js';
import WebSocket          from 'ws';
import TransportServerWSS from 'mole-rpc-transport-ws/TransportServerWSS.js';

import logger             from '../logger.mjs';

import { users }          from './main/index.mjs';

let server = null;

export async function start({ wssPort }) {
    server = new MoleServer({ transports: prepareTransports({ wssPort }) });

    server.expose({ ...users  });
    logger.info(`[JsonRpcApp] STARTING AT PORT [${wssPort}] (via WS)`);
    await server.run();
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


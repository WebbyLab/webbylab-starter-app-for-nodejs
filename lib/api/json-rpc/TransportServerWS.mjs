// TODO: remove on json rpc sessions complete
import uuid         from 'uuid';
import clsNamespace from '../../clsNamespace.mjs';

class TransportServerWS {
    constructor({ wss } = {}) {
        if (!wss) throw new Error('"wss" required');
        this.wss = wss;
    }

    async onData(callback) {
        this.wss.on('connection', ws => {
            ws.on('message', async reqData => {
                clsNamespace.run(async () => {
                    const traceID = uuid.v4();

                    clsNamespace.set('traceID', traceID);
                    clsNamespace.set('ws', ws);
                    // eslint-disable-next-line callback-return
                    const resData = await callback(reqData);

                    if (!resData) return;

                    ws.send(resData);
                });
            });

            ws.on('close', () => {
                ws.terminate();
            });
        });
    }
}

export default TransportServerWS;

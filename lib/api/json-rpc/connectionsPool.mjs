// TODO: remove on json rpc sessions complete
class ConnectionsPool {
    #wsConnectionToAuth = new Map();

    add(ws, sessionData) {
        this.delete(ws);
        this.#wsConnectionToAuth.set(ws, sessionData);

        ws.on('close', () => this.delete(ws));
    }

    get(ws) {
        return this.#wsConnectionToAuth.get(ws);
    }

    delete(ws) {
        this.#wsConnectionToAuth.delete(ws);
    }
}

export default new ConnectionsPool();

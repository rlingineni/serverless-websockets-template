"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sockets = void 0;
const connections_1 = require("./connections");
class Sockets {
    constructor() {
        this.ct = new connections_1.ConnectionsTableHelper();
    }
    async onConnection(connectionId, roomName) {
        const { ct } = this;
        await ct.createConnection(connectionId, roomName);
        console.log(`${connectionId} connected`);
    }
    async onDisconnect(connectionId) {
        const { ct } = this;
        await ct.removeConnection(connectionId);
        console.log(`${connectionId} disconnected`);
    }
    async onMessage(connectionId, body, send) {
        const { ct } = this;
        const roomName = (await ct.getConnection(connectionId)).RoomName;
        const connectionIds = await ct.getConnectionIds(roomName);
        const otherConnectionIds = connectionIds.filter((id) => id !== connectionId);
        const broadcast = (message) => {
            return Promise.all(otherConnectionIds.map((id) => {
                return send(id, message);
            }));
        };
        // Create a Room , and set an expiry on it
        const room = await ct.getOrCreateRoom(roomName, Date.now() / 1000 + 3600);
        // persist any data in the room as needed in an string array
        // await ct.updateRoom("something new we learned")
        await broadcast(body);
    }
}
exports.Sockets = Sockets;
exports.default = Sockets;
//# sourceMappingURL=sockets.js.map
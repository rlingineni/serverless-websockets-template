"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionsTableHelper = exports.TABLE_NAME = void 0;
const ddb_1 = require("../utils/ddb");
exports.TABLE_NAME = `WebSocketConnectionsTable`;
class ConnectionsTableHelper {
    constructor() {
        this.DatabaseHelper = new ddb_1.DDBHelper({
            tableName: exports.TABLE_NAME,
            primaryKeyName: "PartitionKey",
        });
    }
    async createConnection(id, roomName) {
        return this.DatabaseHelper.createItem(id, {
            RoomName: roomName,
            ttl: Date.now() / 1000 + 3600,
        });
    }
    async getConnection(id) {
        const connections = await this.DatabaseHelper.queryItemByKey(id);
        if (connections && connections.length > 0) {
            return connections[0];
        }
        if (!connections || connections.length === 0) {
            await this.removeConnection(id);
            throw undefined;
        }
        return undefined;
    }
    async removeConnection(id) {
        return await this.DatabaseHelper.deleteItem(id);
    }
    async getConnectionIds(roomName) {
        const results = await this.DatabaseHelper.queryItemByKey(roomName, { indexKeyName: "RoomName", indexName: "RoomNameIndex" });
        if (results)
            return results.map((item) => item.PartitionKey);
        return [];
    }
    async getOrCreateRoom(roomName, ttl) {
        const existingDoc = await this.DatabaseHelper.getItem(roomName);
        const roomDetails = {
            Updates: [],
            ttl,
        };
        if (existingDoc) {
            return existingDoc.Updates;
        }
        else {
            await this.DatabaseHelper.createItem(roomName, roomDetails, undefined, true);
            return [];
        }
    }
    async updateRoom(roomName, update) {
        await this.DatabaseHelper.updateItemAttribute(roomName, "Updates", [update], undefined, { appendToList: true });
    }
}
exports.ConnectionsTableHelper = ConnectionsTableHelper;
//# sourceMappingURL=connections.js.map
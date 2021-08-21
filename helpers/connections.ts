import { DDBHelper } from "../utils/ddb";

interface ConnectionItem {
  PartitionKey: string;
  RoomName: string;
  data?: any;
  ttl: number;
}

interface RoomDetailsItem {
  PartitionKey: string;
  Updates: string[];
}

export const TABLE_NAME = `WebSocketConnectionsTable`;

export class ConnectionsTableHelper {
  private DatabaseHelper: DDBHelper;
  constructor() {
    this.DatabaseHelper = new DDBHelper({
      tableName: TABLE_NAME,
      primaryKeyName: "PartitionKey",
    });
  }

  async createConnection(id: string, roomName: string) {
    return this.DatabaseHelper.createItem(id, {
      RoomName: roomName,
      ttl: Date.now() / 1000 + 3600,
    });
  }

  async getConnection(id: string): Promise<ConnectionItem | undefined> {
    const connections =
      await this.DatabaseHelper.queryItemByKey<ConnectionItem>(id);

    if (connections && connections.length > 0) {
      return connections[0];
    }

    if (!connections || connections.length === 0) {
      await this.removeConnection(id);
      throw undefined;
    }

    return undefined;
  }

  async removeConnection(id: string): Promise<boolean> {
    return await this.DatabaseHelper.deleteItem(id);
  }

  async getConnectionIds(roomName: string): Promise<string[]> {
    const results = await this.DatabaseHelper.queryItemByKey<ConnectionItem>(
      roomName,
      { indexKeyName: "RoomName", indexName: "RoomNameIndex" }
    );
    if (results) return results.map((item) => item.PartitionKey);

    return [];
  }

  async getOrCreateRoom(roomName: string, ttl?: number): Promise<string[]> {
    const existingDoc = await this.DatabaseHelper.getItem<RoomDetailsItem>(
      roomName
    );

    const roomDetails = {
      Updates:[],
      ttl,
    };

    if (existingDoc) {
      return existingDoc.Updates;
    } else {
      await this.DatabaseHelper.createItem(
        roomName,
        roomDetails,
        undefined,
        true
      );
      return [];
    }
  }

  async updateRoom(roomName: string, update: string) {
    await this.DatabaseHelper.updateItemAttribute(
      roomName,
      "Updates",
      [update],
      undefined,
      { appendToList: true }
    );
  }
}

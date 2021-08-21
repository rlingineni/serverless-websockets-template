interface ConnectionItem {
    PartitionKey: string;
    RoomName: string;
    data?: any;
    ttl: number;
}
export declare const TABLE_NAME = "WebSocketConnectionsTable";
export declare class ConnectionsTableHelper {
    private DatabaseHelper;
    constructor();
    createConnection(id: string, roomName: string): Promise<boolean>;
    getConnection(id: string): Promise<ConnectionItem | undefined>;
    removeConnection(id: string): Promise<boolean>;
    getConnectionIds(roomName: string): Promise<string[]>;
    getOrCreateRoom(roomName: string, ttl?: number): Promise<string[]>;
    updateRoom(roomName: string, update: string): Promise<void>;
}
export {};

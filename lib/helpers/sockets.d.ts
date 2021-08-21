export declare class Sockets {
    private ct;
    onConnection(connectionId: string, roomName: string): Promise<void>;
    onDisconnect(connectionId: string): Promise<void>;
    onMessage(connectionId: string, body: string, send: (id: string, message: string) => Promise<void>): Promise<void>;
}
export default Sockets;

import { ConnectionsTableHelper } from "./connections";


export class Sockets {
  private ct = new ConnectionsTableHelper();

  async onConnection(connectionId: string, roomName: string) {
    const { ct } = this;
    await ct.createConnection(connectionId, roomName);
    console.log(`${connectionId} connected`);
  }

  async onDisconnect(connectionId: string) {
    const { ct } = this;
    await ct.removeConnection(connectionId);

    console.log(`${connectionId} disconnected`);
  }

  async onMessage(
    connectionId: string,
    body: string,
    send: (id: string, message: string) => Promise<void>
  ) {
    const { ct } = this;

    const roomName = (await ct.getConnection(connectionId)).RoomName;

    const connectionIds = await ct.getConnectionIds(roomName);
    const otherConnectionIds = connectionIds.filter(
      (id) => id !== connectionId
    );
    const broadcast = (message: string) => {
      return Promise.all(
        otherConnectionIds.map((id) => {
          return send(id, message);
        })
      );
    };

    // Create a Room , and set an expiry on it
    const room = await ct.getOrCreateRoom(roomName, Date.now() / 1000 + 3600);

    // persist any data in the room as needed in an string array
    // await ct.updateRoom("something new we learned")
   
    await broadcast(body);
  }
}

export default Sockets;

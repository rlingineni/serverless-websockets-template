import * as WebSocket from "ws";
import Sockets from "../helpers/sockets";

const queryString = require("query-string");

const wss = new WebSocket.Server({ port: 5000 });

const sockets = new Sockets();

const connectedClients = {};

wss.on("connection", (ws, req) => {
  const sendToClient = async (name: string, b64Message: string) => {
    if (connectedClients[name]) {
      connectedClients[name].send(b64Message);
      console.log("Broadcasting Message to peers");
    }
  };

  console.log(queryString.parse(req.url));

  const roomName = queryString.parse(req.url)["room"] || "default";
  const clientName = queryString.parse(req.url)["/?clientName"];

  console.log(roomName);

  connectedClients[clientName] = ws;

  sockets.onConnection(clientName, roomName);

  ws.on("message", (message) => {
    console.log(message.toString());
    sockets.onMessage(clientName, message.toString(), sendToClient);
    console.log("Sending updates to peers");
  });

  //ws.send(`A ${clientName} connected to the  Server!`)
});

wss.on("close", (ws, req) => {
  const name = queryString.parse(req.url)["?name"];
  sockets.onDisconnect(name);
});

console.log("Listening on ws://localhost:5000");

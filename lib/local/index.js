"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = require("ws");
const sockets_1 = require("../helpers/sockets");
const queryString = require("query-string");
const wss = new WebSocket.Server({ port: 5000 });
const sockets = new sockets_1.default();
const connectedClients = {};
wss.on("connection", (ws, req) => {
    const sendToClient = async (name, b64Message) => {
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
//# sourceMappingURL=index.js.map
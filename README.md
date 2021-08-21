# y-serverless

 Serverless Provider using Websockets and DynamoDB for YJS. Easy deploy. Written in typescript.

 Huge shout out to [gaberogan](https://github.com/gaberogan/y-websocket-api/) original repo. 

 Open limitations:

 1. Doesn't work with regular `y-websockets`. AWS sockets requires base64 strings. You need a modifided sockets provider from the client repo to pass b64 strings

 2. Not optimized yet, so may create more clients and data than necessary


 ## Setup


 ### Testing Locally
 ```
 cd api
npm install
npm run start
 ```

Spins up a local server on `ws://localhost:5000`

If you are the client, you won't get a ping back, so run in two instances

Start Client1
```
wscat -c "ws://localhost:5000/?clientName=chat-bot1&room=channel1"
```

Start Client2
```
wscat -c "ws://localhost:5000/?clientName=chat-bot2&room=channel1"
```

### Making Changes
Every client should request to join a room. This can be passed as a query parameter, otherwise, you will join the `default` room.

Edit `helpers/socket.ts` which is an abstraction for the socket API, that enables the same code to be used locally and remotely.


### Deploy to AWS
```
cd api
serverless deploy
```


IAM role to access all indexes is also necessary. Similar to this for the Lambda role:
```
"arn:aws:dynamodb:us-east-1:939884077921:table/WebSocketConnectionsTable/index/*"
```
### See Logs
```
serverless logs -f api
```

### Resources
Creates a DynamoDB table to maintain documents and connection information.
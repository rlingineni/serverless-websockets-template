# Serverless Websockets Template

Websockets Template using DynamoDB to maintain connections and Lambda function. Can also run locally to test the the socket flow

As easy as tweaking this [file](https://github.com/rlingineni/serverless-websockets-template/blob/main/helpers/sockets.ts):

```javascript

onConnection(){}

onDisconnect(){}

onMessage(){}
```


## Setup

Load the template with
```
serverless create --template-url "https://github.com/rlingineni/serverless-websockets-template/tree/main" --path ./api
```

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

IAM role to access all indexes is also necessary. Make sure it exists. Similar to this for the Lambda role:
```
"arn:aws:dynamodb:us-east-1:939884077921:table/WebSocketConnectionsTable/index/*"
```

### See Log Output
```
serverless logs -f api
```

### Resources
This function will creates a DynamoDB table to maintain room and connection information. 



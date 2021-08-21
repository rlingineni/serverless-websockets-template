import Sockets from "./helpers/sockets";


const AWS = require('aws-sdk');
const apig = new AWS.ApiGatewayManagementApi({
  endpoint: process.env.APIG_ENDPOINT
});


const getRoomName = (event:any) => {
  const qs:any = event.multiValueQueryStringParameters
  if(qs && qs.room){
    return qs.room;
  }
  return 'default';
}


const send = async(id:string, message:string) =>{
  await apig.postToConnection({
    ConnectionId: id,
    Data: message
  }).promise();
}

exports.handler = async(event, context) =>  {
  // For debug purposes only.
  // You should not log any sensitive information in production.
  console.log("EVENT: \n" + JSON.stringify(event, null, 2));

  const { body, requestContext: { connectionId, routeKey }} = event;
  const sockets = new Sockets();
  const roomName = getRoomName(event)
  switch(routeKey) {
    case '$connect':{
      await sockets.onConnection(connectionId, roomName)
      return { statusCode: 200, body: 'Connected.' }
    } 
    case '$disconnect':{
      await sockets.onDisconnect(connectionId)
      return { statusCode: 200, body: 'Disconnected.' }
    }
    case '$default':
    default:
      await sockets.onMessage(connectionId, body, send )
      return { statusCode: 200, body: 'Data Sent' };
    
  }
}

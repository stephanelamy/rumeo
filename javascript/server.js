
/////////////////////////////////////////////////////////////////client/////////////////////////////////////////////////////////////////
let pubnub; //assuming were never reseting
function startClient(){
  pubnub = new PubNub({
    publishKey : "pub-c-69240897-b86a-4723-ac74-a1801f32b05d",
    subscribeKey : "sub-c-09c6bc74-b28b-11ec-9e6b-d29fac035801",
    uuid: "client"
  })  
}

function publishMessage(message) {//send a message to the server
  var message = {
      channel : "chat",
      message: {
          line1: message,
          //line2: "extra info"
      }
  }
  pubnub.publish(message, function(status, response) {
      console.log("CLIENT",status, response);
  })
}

/////////////////////////////////////////////////////////////////server/////////////////////////////////////////////////////////////////

function startServer(){
  let pubnubS = undefined; //reset the variable in case it's not the first server
  pubnubS = new PubNub({
    publishKey : "pub-c-69240897-b86a-4723-ac74-a1801f32b05d",
    subscribeKey : "sub-c-09c6bc74-b28b-11ec-9e6b-d29fac035801",
    uuid: "server"
  })

  pubnubS.addListener({
    message: function(msg) {
      console.log("SERVER",msg.message.line1);
      //console.log(msg.message.line2);
      document.getElementById("demo").innerHTML = msg.message.line1;
    }
    })
    
    pubnubS.subscribe({
      channels: ['chat']
    });
}


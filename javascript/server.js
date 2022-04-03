/*to start server in the chat write;
-server
-client
//to send chat
-send
//to send tiles info(still working on it)
-tiles
*/


/////////////////////////////////////////////////////////////////client/////////////////////////////////////////////////////////////////
let pubnub; //assuming were never reseting
function startClient(){
  pubnub = new PubNub({
    publishKey : "pub-c-69240897-b86a-4723-ac74-a1801f32b05d",
    subscribeKey : "sub-c-09c6bc74-b28b-11ec-9e6b-d29fac035801",
    uuid: "client"
  })  
}

function sendChat (archive) {//send a message to the server
  var message = {
      channel : "chat",
      message: {
          line1: archive,
          //line2: "extra info"
      }
  }
  pubnub.publish(message, function(status, response) {
      console.log("CLIENT",status, response);
  })
}

function sendTile (tile,i) {//send a tile's  location in the list,x,y,r,c
  var message = {
      channel : "movement",
      message: {
          line1: i,
          line2: tile.x,
          line3: tile.y,
          line4: tile.r,
          line5: tile.c
      }
  }
  pubnub.publish(message, function(status, response) {
      console.log("CLIENT",status, response);
  })
}

/////////////////////////////////////////////////////////////////server/////////////////////////////////////////////////////////////////
let pubnubS = undefined; //reset the variable in case it's not the first server
function startServer(){
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
      channels: ['chat','movement']
    });
}


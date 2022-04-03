/*to start server in the chat write;
-server
-client
//to send chat
-send
//to send tiles info(still working on it)
-tiles
*/


/////////////////////////////////////////////////////////////////client/////////////////////////////////////////////////////////////////
class Client{
  constructor(){
    this.pubnub = new PubNub({
      publishKey : "pub-c-69240897-b86a-4723-ac74-a1801f32b05d",
      subscribeKey : "sub-c-09c6bc74-b28b-11ec-9e6b-d29fac035801",
      uuid: "client"
    })  

    this.pubnub.addListener({
      message: function(msg) {
        console.log("CLIENT","listening");
        console.log("CLIENT",msg.message.index);
        document.getElementById("demo").innerHTML = msg.message.line1;
      }
    })
  }

  sendChat (archive) {//send a message to the server
    var message = {
        channel : "chat",
        message: {
            archive: archive,
            //line2: "extra info"
        }
    }
    this.pubnub.publish(message, function(status, response) {
        console.log("CLIENT",status, response);
    })
  }

  sendTile (tile) {//send a tile's  location in the list,x,y,r,c
    var message = {
        channel : "movement",
        message: {
            index: tile.no,
            x: tile.x,
            y: tile.y,
            row: tile.row,
            col: tile.col,
            color: tile.color,
            number: tile.number
        }
    }
    this.pubnub.publish(message, function(status, response) {
        console.log("CLIENT",status, response);
    })
  }
}

/////////////////////////////////////////////////////////////////server/////////////////////////////////////////////////////////////////

class Server  {
  constructor(){
    this.pubnub = new PubNub({
      publishKey : "pub-c-69240897-b86a-4723-ac74-a1801f32b05d",
      subscribeKey : "sub-c-09c6bc74-b28b-11ec-9e6b-d29fac035801",
      uuid: "server"
    })
    this.pubnub.addListener({
      message: function(msg) {
        console.log("SERVER","listening");
        if(msg.channel == 'chat'){
          console.log("SERVER",msg.message.archive);
        }
        if(msg.channel == 'movement'){
          console.log("SERVER",msg.message);
        }
       // document.getElementById("demo").innerHTML = msg.message.line1;
      }
    })
    this.pubnub.subscribe({
      channels: ['chat','movement']
    });  
  }
}



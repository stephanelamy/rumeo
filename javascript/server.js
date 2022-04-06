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
  constructor(type){
    this.type = type; // 'player' or 'bot'
    this.setuplist = new Set();
    this.isMaster = false;
    this.pubnub = new PubNub({
      publishKey : "pub-c-69240897-b86a-4723-ac74-a1801f32b05d",
      subscribeKey : "sub-c-09c6bc74-b28b-11ec-9e6b-d29fac035801",
      uuid: UUID // this constant must be defined in file uuid.js: const UUID = 'name';
    })  

    console.log("CLIENT", "created", this.type, UUID);

    this.pubnub.addListener({
      message: (msg) => {
        console.log("listening from channel", msg.channel, msg.message);
        
        if (msg.channel == 'setup') {
          if (msg.message.text == 'join') {  
            const message = {
              text: 'update',
              type: this.type,
              uuid: UUID
            };
            this.sendMsg(message, 'setup');
          } else if (msg.message.text == 'update') {
            this.setuplist.add(msg.message.type + ' ' + msg.message.uuid);
            }
          }

        if(msg.channel == 'chat') {
          this.player.chat.addArchive(msg.message.archive);
        }
      }
    })

    this.pubnub.subscribe({
      channels: ['chat', 'orders', 'setup']
    });  

    this.onConnection();
  }

  sendMsg(message, channel) {
    const msg = {
      channel: channel,
      message: message,
      sendByPost: true // seems to be best practice according to PubNub doc
    };
    try {
      const result = this.pubnub.publish(msg); // in the doc there is an 'await' here
      console.log('sending on channel', channel, message);
      console.log('result', result);
  } catch(error) {
      console.log('error', error);
    }
  }

  onConnection(){
    let message = {
      text: 'join',
    };
    this.sendMsg(message, 'setup');
  }

  onConnectionOLD(){
    let message = {
      text: 'join',
      uuid: UUID,
      type: 'player'
    };
    this.sendMsg(message, 'setup');
    let sleep = ms => {  
      return new Promise(resolve => setTimeout(resolve, ms));  
    };  
    sleep(500).then(() => {  
      if (!this.isOnList) {
        // we are master, update list and send message
        this.isMaster = true;
        this.setuplist.push('player' + ' ' + UUID)
        message = {
          text: 'update',
          list: this.setuplist
        };
        this.sendMsg(message, 'setup');
      }  
    });  
  }

  drawSetUpList() {
    textSize(32);
    textAlign("center");
    text("setting up a game... Master: " + this.isMaster, width/2, 30);
    textAlign("left");
    let i = 0;
    for (const line of this.setuplist) {
      text(line, 10, 40*(i+3));
      i++;
    }
  }

  sendChat (data) {//send a message to the server
    let archive = join(data,"")
    let message= {
      archive: archive,
    };
    this.sendMsg(message, 'chat');
  }

  sendTile (tile) {//send a tile's  location in the list,x,y,r,c 
    // not clear we need that
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

  pickTile() {
    let message = {
      type: "pick"
    };
    this.sendMsg(message, 'movement');
  }
}

/////////////////////////////////////////////////////////////////server/////////////////////////////////////////////////////////////////

class Server  {

  constructor() {
    this.pubnub = new PubNub({
      publishKey : "pub-c-69240897-b86a-4723-ac74-a1801f32b05d",
      subscribeKey : "sub-c-09c6bc74-b28b-11ec-9e6b-d29fac035801",
      uuid: "server"
    });
    
    this.pubnub.addListener({
      message: function(msg) {
        console.log("SERVER","listening");
        // if(msg.channel == 'chat'){
        //   console.log("SERVER",msg.message.archive);
        //   me.chat.addArchive(msg.message.archive);
        // }
        if(msg.channel == 'movement'){
          console.log("SERVER",msg.message);
        }
       // document.getElementById("demo").innerHTML = msg.message.line1;
      }
    })
    this.pubnub.subscribe({
      channels: ['movement']
    });  
  }
}



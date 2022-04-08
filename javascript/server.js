/*to start server in the chat write;
-server
-client
//to send chat
-send
//to send tiles info(still working on it)
-tiles
*/

function sendMsg(pubnub, message, channel) {
  const msg = {
    channel: channel,
    message: message,
    sendByPost: true // seems to be best practice according to PubNub doc
  };
  try {
    const result = pubnub.publish(msg); // in the doc there is an 'await' here
    console.log('sending on channel', channel, message);
    console.log('result', result);
  } catch(error) {
      console.log('error', error);
    }
}


/////////////////////////////////////////////////////////////////client/////////////////////////////////////////////////////////////////
class Client{
  constructor(type){
    this.type = type; // 'player' or 'bot'
    this.setuplist = [];
    this.pubnub = new PubNub({
      keepAlive: true,
      publishKey : "pub-c-69240897-b86a-4723-ac74-a1801f32b05d",
      subscribeKey : "sub-c-09c6bc74-b28b-11ec-9e6b-d29fac035801",
      uuid: UUID // this constant is defined in file uuid.js: const UUID = 'name';
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
              uuid: UUID,
              master: false
            };
            sendMsg(this.pubnub, message, 'setup');
          } 
          
          if (msg.message.text == 'update') {
            console.log('check', msg.message.master);
            if (msg.message.master){// this player becomes master
              console.log('changing master');
              for (const item of this.setuplist) {
                console.log(item);
                if (item.uuid == msg.message.uuid && item.type == 'player') {
                  item.master = ! item.master;
                }
              }
            } else {
              let player = {
                type: msg.message.type,
                uuid: msg.message.uuid,
                master: false
              } 
              let alreadyThere = false;
              for (const item of this.setuplist) {
                if (item.type == player.type && item.uuid == player.uuid) {
                  alreadyThere = true;
                }
              }
              console.log(alreadyThere);
              if (! alreadyThere) {
                this.setuplist.push(player);
              } 
            }
          }

          if (msg.message.text == 'start') {
            if (this.client.isMaster()) {
              game = new Game(this.client.setuplist);
            }
          }
        }

        if(msg.channel == 'chat') {
          this.player.chat.addArchive(msg.message.archive);
        }
      }
    });

    const mychannel = this.type + ' ' + UUID;
    this.pubnub.subscribe({
      channels: ['chat', 'setup', mychannel]
    });  

    this.onConnection();
  }

  sendMsgOLD(message, channel) {
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
    sendMsg(this.pubnub, message, 'setup');
  }

  addBot(){
    const message = {
      text: 'update',
      type: 'bot',
      uuid: UUID,
      master: false
    };
    sendMsg(this.pubnub, message, 'setup');
  }

  toggleMaster() {
    const message = {
      text: 'update',
      type: 'player',
      uuid: UUID,
      master: true
    };
    sendMsg(this.pubnub, message, 'setup');
  }

  nbMaster() {
    let count = 0;
    for (const item of this.setuplist) {
      if (item.master) {
        count ++;
      }
    }
    return count;
  }

  isMaster() {
    for (const item of this.setuplist) {
      if (item.master && item.uuid == UUID) {
        return true;
      }
    }
    return false;
  }

  startGame() {
    const message = {
      text: 'start',
    };
    sendMsg(this.pubnub, message, 'setup');
  }

  drawSetUpList() {
    textSize(32);
    textAlign("center");
    text("setting up a game...", width/2, 30);
    textAlign("left");
    let i = 0;
    for (const player of this.setuplist) {
      let line = player.type + ' ' + player.uuid;
      if (player.master) {
        line += ' (master)';
      }
      text(line, 10, 40*(i+3));
      i++;
    }
  }

  sendChat (data) {//send a message to the server
    let archive = join(data,"")
    let message= {
      archive: archive,
    };
    sendMsg(this.pubnub, message, 'chat');
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
    sendMsg(this.pubnub, message, 'movement');
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



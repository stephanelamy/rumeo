/*to start server in the chat write;
-server
-client
//to send chat
-send
//to send tiles info(still working on it)
-tiles
*/

/// abstract class with sending function for both client and server ///

class AbstractPubNub{
  constructor(){
    this.pubnub = new PubNub({
      keepAlive: true,
      publishKey: "pub-c-69240897-b86a-4723-ac74-a1801f32b05d",
      subscribeKey: "sub-c-09c6bc74-b28b-11ec-9e6b-d29fac035801",
      uuid: 'abstract' // uuid has to be setup by the children class 
    })  
  }

  sendMsg(message, channel) {
    const msg = {
      channel: channel,
      message: message,
      sendByPost: true // seems to be best practice according to PubNub doc
    };
    try {
      const result = this.pubnub.publish(msg); // in the doc there is an 'await' here
      const senderUUID = this.pubnub.getUUID();
      console.log(senderUUID, 'sending on channel', channel, message);
      console.log('result', result);
    } catch(error) {
        console.log('error', error);
      }
  }
}

//////////////////////////////////////////////////////////////// client ////////////////////////////////////////////////////////////////

class Client extends AbstractPubNub{
  constructor(type){
    super();
    this.type = type; // 'player' or 'bot'
    this.setuplist = []; // list of players or bots ready to start a game
    this.pubnub.setUUID(UUID); // this constant is defined in file uuid.js: const UUID = 'name';

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
            this.sendMsg(message, 'setup');
          } 
          
          if (msg.message.text == 'update') {
            if (msg.message.master){// this player becomes master
              console.log('changing master');
              for (const item of this.setuplist) {
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
    console.log(this.pubnub);
    this.sendMsg(message, 'setup');
  }

  addBot(){
    const message = {
      text: 'update',
      type: 'bot',
      uuid: UUID,
      master: false
    };
    this.sendMsg(message, 'setup');
  }

  toggleMaster() {
    const message = {
      text: 'update',
      type: 'player',
      uuid: UUID,
      master: true
    };
    this.sendMsg(message, 'setup');
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
    this.sendMsg(message, 'setup');
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

class Server extends AbstractPubNub {

  constructor() {
    super();
    this.pubnub.setUUID('server');
    
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



// OLD WAY:

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
      logVerbosity: false, 
      publishKey: "pub-c-69240897-b86a-4723-ac74-a1801f32b05d",
      subscribeKey: "sub-c-09c6bc74-b28b-11ec-9e6b-d29fac035801",
      uuid: 'abstract' // uuid has to be setup by the children class 
    })  
  }

  async _sendMsg(message, channel) {
    const msg = {
      channel: channel,
      message: message,
      sendByPost: true // seems to be best practice according to PubNub doc
    };
    try {
      if (PUBNUBVERBOSE) { console.log('sending on channel', channel, message); }
      const result = await this.pubnub.publish(msg); // 'await' here as in the doc, and sendMsg is async function
      return result; // message was sent 
    } catch(error) {
        console.log('error', error);
      }
  }

  sendMsg(message, channel) {
    this._sendMsg(message, channel).then(
      function(value) { }, // console.log('message sent', value);
      function(error) { console.log('error in sending', error); }
    );
  }
}

//////////////////////////////////////////////////////////////// client ///////////////////////////////////////////////

class Client extends AbstractPubNub{
  constructor(player, type){
    super();
    this.player = player;
    this.gameInfo = { channelList:0, deck:0 };
    this.type = type; // 'player' or 'bot_n'
    this.setuplist = []; // list of players or bots ready to start a game
    this.pubnub.setUUID(UUID); // this constant is defined in file uuid.js: const UUID = 'name';
    this.mychannel = this.type + '_' + UUID;
    this.pubnub.subscribe({ channels: ['chat', 'setup', 'info', this.mychannel] }); 

    this.pubnub.addListener({
      status: (statusEvent) => {
        if (statusEvent.category === "PNConnectedCategory") {
            console.log(this.type, UUID, 'connected');
            if (this.type == 'player') {
              this.onConnection();
            } else {
              this.player.game.pickStartingTiles(this.mychannel);
            }
        }
      },

      message: (msg) => {
        if (PUBNUBVERBOSE) { console.log("listening from channel", msg.channel, msg.message);}
        
        //////////////////// SET UP ////////

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
            if (msg.message.master){// toggle master for this player
              console.log('changing master');
              for (const item of this.setuplist) {
                if (item.uuid == msg.message.uuid && item.type == 'player'){ 
                  item.master = ! item.master; 
                }
              }
            } else {
              let player = {
                type: msg.message.type,
                uuid: msg.message.uuid,
                master: false
              } 
              if (ALWAYSMASTER && player.type == 'player') { player.master = true; }
              let alreadyThere = false;
              for (const item of this.setuplist) {
                alreadyThere = alreadyThere || (item.type == player.type && item.uuid == player.uuid);
                }
              if (! alreadyThere) { this.setuplist.push(player); } 
            }
          }

          if (msg.message.text == 'start') {
            this.player.status = 'playing';
            if (this.isMaster()) {
              const channelList = [];
              for (const item of this.setuplist) {
                if (item.type == 'player') {
                  channelList.push(item.type + '_' + item.uuid);
                } else {
                  channelList.push(item.type + '_' + item.uuid + '_' + UUID);
                }
              }
              this.player.game = new Game(channelList);
              for (const item of this.setuplist) {
                if (item.type != 'player') {
                  this.player.game.bot.push(new BotPlayer('bot_' + item.uuid, this.player.game));
                }
              }
            }
          }
        }

        ///////// CHAT ////////////////

        if(msg.channel == 'chat') {
          this.player.chat.addArchive(msg.message.archive);
        }

        //////// INFO ///////////////////

        if (msg.channel == 'info') {
          if (PUBNUBVERBOSE) { console.log('info', this.mychannel, this.gameInfo); }
          
          if (msg.message.text == 'deck') {
            this.gameInfo[msg.message.channelplayer] ++;
            this.gameInfo.deck --;
          }
        }

        ///////// MY CHANNEL ////////////

        if(msg.channel == this.mychannel) {
          if (msg.message.text == 'deck') {
            for (const no of msg.message.no) {
              this.player.rack.addTile(no);
            }
            if (msg.message.no.length > 1) { // first 14 tiles, init gameInfo
              this.gameInfo.channelList = msg.message.channelList;
              for (const channelplayer of this.gameInfo.channelList) {
                this.gameInfo[channelplayer] = 14;
              }
              this.gameInfo.deck = this.player.tile.length - 14*this.gameInfo.channelList.length;
            }
          }

          if (msg.message.text == 'yourturn') {
            this.player.move();
          }
        }
      }
    });
  }

  onConnection(){
    let message = {
      text: 'join',
    };
    this.sendMsg(message, 'setup');
  }

  addBot(){
    const message = {
      text: 'update',
      type: 'bot',
      uuid: (this.botNumber() + 1).toString(),
      master: false
    };
    this.sendMsg(message, 'setup');
  }

  botNumber(){
    let count = 0;
    for (const item of this.setuplist){
      if (item.type == 'bot') {
        count++;
      }
    }
    return count;
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
      if (item.master) { count ++; }
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

  sendTile (tile, old_row=-1, old_col=-1) {//send a tile's  location in the list,r,c 
    // not clear we need all that
    var message = {
        channel : "server",
        message: {
          text: 'table',
          no: tile.no,
          row: tile.row,
          col: tile.col,
          old_row: old_row,
          old_col: old_col,
          channelplayer: this.mychannel
        }
    }
    this.sendMsg(message, 'server');
  }

  transmitMove() {
    const message = {
      text: 'table',
      move: '', // description of the moves
      channelplayer: this.mychannel
    };
    this.sendMsg(message, 'server');
  }

  pickTile() {
    let message = {
      text: 'pick',
      channelplayer: this.mychannel
    };
    this.sendMsg(message, 'server');
  }
}

/////////////////////////////////////////////////////////////////server////////////////////////////////////////////////

class Server extends AbstractPubNub {
  constructor(game) {
    super();
    this.game = game;
    this.pubnub.setUUID('server');
    this.pubnub.subscribe({ channels: ['server'] });  

    this.pubnub.addListener({
      status: (statusEvent) => {
        if (statusEvent.category === "PNConnectedCategory") {
            console.log('server connected');
            console.log('channel list:', this.game.channelList);
            for (const channel of this.game.channelList) {
              if (channel.slice(0,3) != 'bot') {
                this.game.pickStartingTiles(channel);
              }
            }
        }
      },

      message: (msg) => {
        if (PUBNUBVERBOSE) { console.log('server listening', msg.message); }
        if (msg.message.text == 'pick') {
          this.game.pickOneTile(msg.message.channelplayer); 
          this.nextMove();
        }
        
        if (msg.message.text == 'table') {
          this.nextMove();
        }
      }
    });
  }

  nextMove() {
    this.game.activePlayer++;
    if (this.game.activePlayer >= this.game.channelList.length) {
      this.game.activePlayer = 0;
    } 
    let channel = this.game.channelList[this.game.activePlayer];
    let message = {
      text: "yourturn",
      channelplayer: channel
    };
    this.sendMsg(message, channel);
  }
}



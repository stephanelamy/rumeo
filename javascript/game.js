class Game{
  constructor(channelList, numberTiles){
    console.log('creating game and server');
    this.deck = new Set();
    for (let i=0; i<numberTiles; i++){ 
      this.deck.add(i);
    }
    this.channelList = channelList;
    this.activePlayer = -1;
    this.bot = []; // will be used to host bots
    this.server = new Server(this);
    this.server.nextMove();
  }

  isActive(channelplayer) {
    return this.channelList[this.activePlayer] == channelplayer;
  }

  chooseNo() {
    let chosenNo;
    let index = randomInteger(1, this.deck.size); 
    let i = 1;
    for (const no of this.deck){
      if (i == index){
        chosenNo = no;
      }
      i++;
    }
    this.deck.delete(chosenNo);
    return chosenNo;
  }

  pickStartingTiles(channelplayer){
    let chosenNo;
    let listNo = [];
    for (let j = 0; j < 14; j++){
      chosenNo = this.chooseNo();
      listNo.push(chosenNo);
    }
    const message = {
      text: 'deck',
      no: listNo,
      channelList: this.channelList
    };
    this.server.sendMsg(message, channelplayer);
  }

  pickOneTile(channelplayer){
    const chosenNo = this.chooseNo(); 
    let message = {
      text: 'deck',
      no: [chosenNo]
    };
    this.server.sendMsg(message, channelplayer);
    message = {
      text: 'deck',
      channelplayer: channelplayer
    };
    this.server.sendMsg(message, 'info');
  }
}
  


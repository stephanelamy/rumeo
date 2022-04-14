class Game{
  constructor(channelList){
    console.log('creating game and server');
    this.deck = new Set();
    for (let i=0; i<104; i++){ // serait mieux d'éviter ce 104 en dur
      this.deck.add(i);
    }
    this.channelList = channelList;
    this.activePlayer = -1;
    this.bot = []; // will be used to host bots
    this.server = new Server(this);
    this.server.nextMove();
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
      no: listNo
    };
    this.server.sendMsg(message, channelplayer);
  }

  pickOneTile(channelplayer){
    const chosenNo = this.chooseNo(); 
    const message = {
      text: 'deck',
      no: [chosenNo]
    };
    this.server.sendMsg(message, channelplayer);
  }
}
  


class Game{
  constructor(channelList){
    console.log('creating game and server');
    this.deck = new Set();
    for (let i=0; i<104; i++){ // serait mieux d'éviter ce 104 en dur
      this.deck.add(i);
    }
    this.channelList = channelList;
    this.activePlayer = 0;
    this.bot = []; // will be used to host bots
    this.server = new Server(this);
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

  pickStartingTilesOLD(){
    let chosenNo;
    let listNo;
    for (const channel of this.channelList) {
      listNo = [];
      for (let j = 0; j < 14; j++){
        chosenNo = this.chooseNo();
        listNo.push(chosenNo);
      }
      console.log('list', listNo);
      const message = {
        text: 'deck',
        no: listNo
      };
      this.server.sendMsg(message, channel);
    }
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
  

// MOVE ALL THESE IN UTILS??

// For the moment I don't consider jokers
// hand is an array of tile numbers

function isPreSerie(hand) {
  //  Tiles with the same number, and distinct colors
  const colorSet = new Set();
  const numberSet = new Set();
  for (const index of hand) {
    colorSet.add(this.tile[index].color);
    numberSet.add(this.tile[index].number);
  }
  return numberSet.size == 1 && colorSet.size == hand.length;
}

function isSerie(hand) {
  // 3 or 4 tiles with the same number, and distinct colors
  return hand.length > 2 && this.isPreSerie(hand);
}

function isPresequence(hand) {
  // all same color, with consecutive numbers
  const colorSet = new Set();
  const numberArray = [];
  for (const index of hand) {
    colorSet.add(this.tile[index].color);
    numberArray.push(this.tile[index].number);
  }
  return colorSet.size == 1 && hand.length == Math.max(...numberArray) - Math.min(...numberArray) + 1;
}

function isSequence(hand) {
//   At least 3 tiles, all same color, with consecutive numbers
return hand.length > 2 && this.isPresequence(hand);
}

function isCombination(hand) {
  return isSerie(hand) || isSequence(hand);
}
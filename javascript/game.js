class Game{
  constructor(playerArray){
    console.log('creating game and server');
    this.server = new Server();
    this.deck = new Set();
    for (let i=0; i<104; i++){ // serait mieux d'éviter ce 104 en dur
      this.deck.add(i);
    }
    this.players = playerArray;
    this.pickStartingTiles();
  }

  pickOneTile(player){
    if (this.deck.size == 0){
      return 'empty deck';
    }
    const index = randomInteger(1, this.deck.size); 
    let i = 1;
    let chosenNo;
    for (const no of this.deck){
        if (i == index){
          chosenNo = no;
        }
        i++;
    }
    this.deck.delete(chosenNo);
    const message = {
      text: 'deck',
      no: 'hidden',
    };
    for (const item of this.players){
      if (item.uuid == player.uuid && item.type == player.type) {
        message.no = chosenNo;
      } else {
        message.no = 'hidden';
      }
      const channel = item.type + ' ' + item.uuid;
      this.server.sendMsg(message, channel);
    }
    // player.rack.addTile(chosenNo); // old way
    }

  pickStartingTilesOLD(){
    for (let i = 0; i < this.players.length; i++){
      for (let j = 0; j < 14; j++){
        this.pickOneTile(this.players[i]);
      }
    }
  }

  pickStartingTiles(){
    let chosenNo;
    let listNo;
    for (let i = 0; i < this.players.length; i++){
      listNo = [];
      for (let j = 0; j < 14; j++){
        let index = randomInteger(1, this.deck.size); 
        let i = 1;
        for (const no of this.deck){
            if (i == index){
              chosenNo = no;
            }
            i++;
        }
        listNo.push(chosenNo);
        this.deck.delete(chosenNo);
      }
      console.log('list', listNo);
      const message = {
        text: 'deck',
        no: listNo
      };
      const channel = this.players[i].type + ' ' + this.players[i].uuid;
      this.server.sendMsg(message, channel);
    }
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
class Game{
  constructor(nbPlayers){
      this.tile = []; 
      this.createTiles();//cree toutes les tuiles avec des images JOKERS A AJOUTER PLUS TARD
      this.deck = new Set();
      for (let i=0; i<this.tile.length; i++){
        this.deck.add(i);
      }
      this.rack = []; // array of RackGrid    set goes from 1-n  with 'empty' and n = maximum tiles to be shown(default 20)
      this.table = new TableGrid(4,10, this.tile,-1);
      this.nbPlayers = nbPlayers;
      for (let i = 0; i < nbPlayers; i++){
          this.rack[i] = new RackGrid(2,10, this.tile,i+1); 
          console.log(this.rack[i]);
      }
      this.ourID = 0;
      this.moving = [];//list of moving tiles
      this.pickStartingTiles();
  }

  pickOneTile(noPlayer){
    const index = randomInteger(1, this.deck.size); 
    let i = 1;
    let chosenNo;
    for (const no of this.deck){
        if (i == index){
            chosenNo = no;
        }
        i++;
    }
    this.deck.delete(chosenNo);//
    this.tile[chosenNo].size = Tile.computeSize(this.rack[noPlayer].cols);
    this.rack[noPlayer].addTile(chosenNo);
    }

  pickStartingTiles(){
    for (let i = 0; i < this.nbPlayers; i++){
      for (let j = 0; j < 14; j++){
        this.pickOneTile(i);
      }
    }
  }
  
  createTiles(){
    //cree les tuiles
    for (let copie = 1; copie <= 2; copie++){
      for (let c = 1; c <= 4; c++){
        for (let n = 1; n <= 13 ; n++){
          this.tile.push(new Tile(c, n));
        }
      }
    }
  }

  drop(){//drop and/or swap n with wherever it is
    for(let i = this.moving.length-1;i>=0;i--){//go throught the list backwards so that if we delete a variable we don't cal 2 times
      let n = this.moving[i];
      let rackToTest = this.rack[this.ourID];
      if(overlap(rackToTest.cornerX(),rackToTest.cornerY(),rackToTest.width(),rackToTest.height(),...this.tile[n].center())){
        this.rack[this.ourID].swap(n);
      }else
      rackToTest = this.table; 
      if(overlap(rackToTest.cornerX(),rackToTest.cornerY(),rackToTest.width(),rackToTest.height(),...this.tile[n].center())){
        this.table.swap(n);
      }else{
        this.tile[n].grid.putTile(n,this.tile[n].row,this.tile[n].col);
        // switch(this.tile[n].grid){//put the tile back where it came from
        //   case -1:
        //     this.table.putTile(n,this.tile[n].row,this.tile[n].col);
        //     break;
        //   default:
        //     this.rack[this.tile[n].grid-1].putTile(n,this.tile[n].row,this.tile[n].col);
        //     break;
        // }
      }
      this.tile[n].moving = false;
    }
    this.moving = [];
  }

  checkMoving(){//update and draw moving tiles
    for (const no of game.moving){
      this.tile[no].x = mouseX; 
      this.tile[no].y = mouseY;
      this.tile[no].draw()
    }
  }

  checkDeck(){//check if we clicked on the deck
    return overlap(...this.deckCoor(),mouseX,mouseY);
  }

  deckCoor(){//deck coor are stocked here in case we want to change them :P
    let rack = this.rack[this.ourID]//proportinal to be in between the rack and the right side
    let deckWidth = Tile.computeSize(10);
    let deckHight = Tile.computeSize(10)*3/2;
    let deckX = (width + rack.cornerX() + rack.width() - deckWidth)/2;
    let deckY = rack.cornerY();
    return [deckX,deckY,deckWidth,deckHight];
  }

  drawDeck(){
    push();
    rect(...this.deckCoor());
    pop();
  }

  draw(){
    this.drawDeck();
    this.table.draw();
    this.rack[this.ourID].draw();
    this.checkMoving();
  }
}
  
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
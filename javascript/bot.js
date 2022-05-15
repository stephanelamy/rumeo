class BotPlayer extends Player{
  constructor(name, game) { // name has the form 'bot_1', 'bot_2'...
    super();
    this.rack = new BotGrid(3,7,this.tile);
    this.game = game;
    this.client = new Client(this, name);
  }

  move() {
    if (DEVMODE){
      console.log('bot moving');
    }
    
    // try to put some tiles by groups
    this.rack.sort(compareTiles678);
    const internalRack = this.rack.asArray();
    console.log('internalRack', internalRack);
    const internalTable = [];
      // look for a sequence
    


    // try to increase some groups already on table

    // for later: try some more involved recombination

    // if everything fails: pick a tile

    this.client.pickTile();

    // if (this.rack.isEmpty()) {
    //   this.client.pickTile();
    // } else {
    //   this.rack.sort(compareTiles777());
    //   index = this.rack.place[0][0];
    //   // put tile index on table
    // }
  }

  
}
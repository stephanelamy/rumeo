class BotPlayer extends Player{
  constructor(name, game) { // name has the form 'bot_1', 'bot_2'...
    super();
    this.rack = new BotGrid(3,7,this.tile);
    this.game = game;
    this.client = new Client(this, name);
    this.filter = new Filter(this.tile);
  }

  move() {
    if (DEVMODE){
      console.log('bot moving');
    }
    
    // try to put some tiles by groups
    this.rack.sort(compareTiles678);
    const internalRack = this.rack.asArray();
    console.log('internalRack', internalRack);
    let group = [];
    const listOrder = [];
      // look for a sequence
    let oldNo = 'none';
    for (const no of internalRack){
      if (oldNo == 'none' || this.tile[oldNo].colour != this.tile[no].colour || this.tile[oldNo].number != this.tile[no].number){
        group.push(no);
        if (!this.filter.isPreCombination(group)){
          group = [no];
        } else {
          if (this.filter.isCombination(group)){
            listOrder.push([group]);
            console.log('new order:', groupString(group, this.tile));
            group = [];
          }
        }
      }
      console.log('current group:', groupString(group, this.tile));
      oldNo = no;
    }


    // try to increase some groups already on table

    // for later: try some more involved recombination

    // if everything fails: pick a tile

    if (listOrder.length > 0){
      for (const order of listOrder){
        this.client.transmitMove(order);
      }
    } else{
      this.client.pickTile();
    }

    // if (this.rack.isEmpty()) {
    //   this.client.pickTile();
    // } else {
    //   this.rack.sort(compareTiles777());
    //   index = this.rack.place[0][0];
    //   // put tile index on table
    // }
  }

  
}
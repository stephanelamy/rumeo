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
    let internalRack = this.rack.asArray();
    const listOrder = [];
    let listGroup = [];
    let group = [];
    let oldNo = 'none';
    let auxArray = [];
    for (const functionSort of [compareTiles678, compareTiles777]){
      auxArray = [];
      for(const no of internalRack){
        auxArray.push(this.tile[no]);
      }
      auxArray.sort(functionSort);
      internalRack = [];
      for(const tile of auxArray){
        internalRack.push(tile.no);
      }
      console.log('internalRack', groupString(internalRack, this.tile));
      listGroup = [];
      group = [];
      oldNo = 'none';
      for (const no of internalRack){
        if (oldNo == 'none' || this.tile[oldNo].color != this.tile[no].color || this.tile[oldNo].number != this.tile[no].number){
          group.push(no);
          if (!this.filter.isPreCombination(group)){
            group = [no];
          } else {
            if (this.filter.isCombination(group)){
              listGroup.push(group);
              console.log('new group:', groupString(group, this.tile));
              group = [];
            }
          }
          // console.log(groupString([no], this.tile), 'current group:', groupString(group, this.tile));
        }
        oldNo = no;
      }
      let auxSet = new Set(internalRack);
      for (const group of listGroup){
        console.log('deleting', groupString(group, this.tile));
        for (const no of group){
          auxSet.delete(no);
        }
        listOrder.push([group]);
      }
      internalRack = [...auxSet];
    }

    // try to increase some groups already on table

    // for later: try some more involved recombination

    // if everything fails: pick a tile

    if (listOrder.length > 0){
      console.log('at least one order')
      console.log('new internalRack', groupString(internalRack, this.tile));
      this.rack.initFromArray(internalRack, false, true);
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
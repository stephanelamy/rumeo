class Player{
    constructor() {
      this.tile = []; 
      this.createTiles(); // locally create all tiles and load images JOKERS A AJOUTER PLUS TARD
      this.rack = new RackGrid(2,10,this.tile);
      this.table = new TableGrid(4,16,this.tile);
      this.chat  = new Chat();
      this.client = new Client();
    }

    createTiles(){
        for (let copie = 1; copie <= 2; copie++){
          for (let colour = 1; colour <= 4; colour++){
            for (let number = 1; number <= 13 ; number++){
              this.tile.push(new Tile(colour, number));
            }
          }
        }
        // Each tile knows its own index
        for (let index = 0; index < this.tile.length; index++){
          this.tile[index].no = index;
        }
      }
}


class HumanPlayer extends Player{
  constructor() {
      super();
      this.deckImage = loadImage("png/tile_deck.png");
      this.image777 = loadImage("png/tile_777.png");
      this.image678 = loadImage("png/tile_678.png");
      this.moving = []; // list of moving tiles
  }

  // Drawing routines:

  draw(){
      this.textStatus();
      this.drawDeck();
      this.table.draw();
      this.rack.draw();
      this.checkMoving();
      this.chat.draw();
    }

  textStatus(){
    let [isCompletable, isValid] = this.table.parse();
    let message = 'Completable: ' + isCompletable + '  Valid: ' + isValid;
    textSize(32);
    textAlign("center");
    text(message, width/2, 30);
  }

  deckWidth(){
    return Tile.computeSize(10);
  }

  deckHeight(){
    return this.deckWidth() * 1.5;
  }


  drawDeck(){
    image(this.deckImage, this.deckX(), this.deckY(), this.deckWidth(), this.deckHeight());
    image(this.image777, this.deckX(), this.deckY777(), this.deckWidth(), this.deckHeight());
    image(this.image678, this.deckX(), this.deckY678(), this.deckWidth(), this.deckHeight());
  }

  deckX(){
    return width - this.deckWidth()*1.2;
  }

  deckY(){
    return height - 3 * this.deckHeight() * 1.1;
  }

  deckY777(){
    return this.deckY() + this.deckHeight() * 1.1;
  }

  deckY678(){
    return this.deckY() + 2 * this.deckHeight() * 1.1;
  }

  checkMoving(){//update and draw moving tiles
    for (const index of this.moving){
      this.tile[index].x = mouseX; 
      this.tile[index].y = mouseY;
      this.tile[index].draw();
    }
  }

  // Clicked mouse routines:
  
  mouseWasPressed(){
    //check if we select a tile
    for(let i=0; i < this.tile.length; i++){
      if(overlap(...me.tile[i].rectangle(), mouseX, mouseY)){
        me.tile[i].moving = true;
        me.moving.push(i);
      }
    }

    this.chat.bouton(); //to close or open chat

    //check if we press on the deck
    if(this.checkDeck()){
      return "pick_tile";
    }

    //check if we press on sort777
    if(this.checkSort777()){
      this.rack.sort(compareTiles777);
    }

    //check if we press on sort678
    if(this.checkSort678()){
        this.rack.sort(compareTiles678);
    }
  }

  checkDeck(){ //check if we clicked on the deck
    return overlap(...this.deckRectangle(),mouseX, mouseY);
  }
  
  checkSort777(){ //check if we clicked on sort777
    return overlap(...this.sort777Rectangle(),mouseX, mouseY);
  }

  checkSort678(){//check if we clicked on sort777
    return overlap(...this.sort678Rectangle(),mouseX, mouseY);
  }

  deckRectangle(){
    return [this.deckX(), this.deckY(), this.deckWidth(), this.deckHeight()];
  }

  sort777Rectangle(){
    return [this.deckX(), this.deckY777(), this.deckWidth(), this.deckHeight()];
  }

  sort678Rectangle(){
    return [this.deckX(), this.deckY678(), this.deckWidth(), this.deckHeight()];
  }  

  // released mouse routine:

  drop(){ //drop and/or swap n with wherever it is
    for(let i = 0;  i < this.moving.length; i++){ 
      let n = this.moving[i];
      if(overlap(...this.rack.rectangle(),...this.tile[n].center())){
        this.rack.swap(n);
      }else if(overlap(...this.table.rectangle(),...this.tile[n].center())){
        this.table.swap(n);
      }else{
        this.tile[n].grid.putTile(n,this.tile[n].row,this.tile[n].col);
      }
      this.tile[n].moving = false;
      this.client.sendTile(this.tile[n]);
    }
    this.moving = [];
  }
}


class BotPlayer extends Player{
  constructor() {
    super();
  }

  move() {
    if (this.rack.isEmpty()) {
      // pick tile in deck
    } else {
      this.rack.sort(compareTiles777());
      index = this.rack.place[0][0];
      // put tile index on table
    }
  }
}
class Player{
    constructor() {
      this.tile = []; 
      this.createTiles(); // locally create all tiles and load images JOKERS A AJOUTER PLUS TARD
      this.rack = new RackGrid(2,10,this.tile);
      this.table = new TableGrid(4,16,this.tile);
      this.chat  = new Chat();
      this.status = "setup"; // game state, "setup" or "playing" 
      this.activePlayer = false; // should be true when it's our turn to play
      this.hasMoved = false; // true after one tile was put on table in a turn
      this.game = 0; // will be used only by master player
    }

    createTiles(){
        for (let copie = 1; copie <= 2; copie++){
          for (let colour = 1; colour <= 4; colour++){
            for (let number = 1; number <= 13 ; number++){
              this.tile.push(new Tile(colour, number));
            }
          }
        }
        // Each tile knows its own numero
        for (let no = 0; no < this.tile.length; no++){
          this.tile[no].no = no;
        }
      }
}


class HumanPlayer extends Player{
  constructor() {
      super();
      this.client = new Client(this, 'player');
      this.image = {
        deck :   loadImage("png/tile_deck.png"),
        d777 :   loadImage("png/tile_777.png"),
        d678 :   loadImage("png/tile_678.png"),
        player1: loadImage("png/tile_player1.png"),
        player2: loadImage("png/tile_player2.png"),
        player3: loadImage("png/tile_player3.png"),
        player4: loadImage("png/tile_player4.png"),
        empty:   loadImage("png/tile_empty.png"),
        ok :     loadImage("png/tile_OK.png")
      };
      this.moving = []; // list of moving tiles (mouse or animation ?)
  }

  move() {
    this.activePlayer = true;
    this.hasMoved = false;
  }
  // Event routines:

  mousePressed(){ 
    if (this.status == 'playing') {
      this.mouseWasPressed();
    }
  }
  
  mouseReleased(){
    if (this.status == 'playing') {
      this.drop();
    }
  }
  
  keyPressed(){
    if  (this.status == 'setup') {
      this.setupKey(); 
    }
    if (this.status == 'playing') {
      this.chat.clavier();
    }
  }
  
  mouseWheel(event) {
    if (this.status == 'playing') {
      this.chat.scroll(event);
    }
  }
  
  // Setting up :

  setupKey() {   
    if (keyCode == ENTER){
      if (this.client.nbMaster() == 1) {
        this.client.startGame();
      }
    }
      
    if (key == 'b'){
      this.client.addBot();
    }
    
    if (key == 'm'){
      this.client.toggleMaster();
    }
  }

  // Drawing routines:

  draw(){
    background(150);
    if (this.status == "setup") {
      this.drawSetUp();
    } else {
    this.textStatus();
    this.drawDeck();
    this.drawPlayers();
    this.table.draw();
    this.rack.draw();
    this.checkMoving();
    this.chat.draw();
    }
  }

  drawSetUp() {
    this.client.drawSetUpList();
  }

  textStatus(){
    let [isCompletable, isValid] = this.table.parse();
    let message = 'Completable: ' + isCompletable + '  Valid: ' + isValid + ' active:' + this.activePlayer;
    textSize(32);
    textAlign("center");
    text(message, width/2, 30);
  }

  deckWidth(){
    return width * 0.08;
    // return Tile.computeSize(10);
  }

  deckHeight(){
    return this.deckWidth() * 1.5;
  }

  hasFinished(){
    let [isCompletable, isValid] = this.table.parse();
    return (isValid && this.hasMoved);
  }

  drawDeck(){
    let deckname;
    if (this.hasFinished()) {
      deckname = 'ok';
    } else {
      deckname = 'deck';
    }
    for (const name of [deckname, 'd777', 'd678']) {
      image(this.image[name], this.deckX(), this.deckY(name), this.deckWidth(), this.deckHeight());
    }
  }

  deckX(){
    return width - this.deckWidth()*1.1;
  }

  deckY(name){
    const coeff = {
      deck : 3,
      ok : 3,
      d777 : 2,
      d678 : 1    
    }; 
    return height - coeff[name] * this.deckHeight() * 1.1;
  }

  drawPlayers() {
    let i = 1;
    for (const channel of this.game.channelList) {
      if (this.game.isActive(channel)) {
        strokeWeight(5); 
        stroke('red');
        rect(this.deckWidth()*0.1, 
          height - i*this.deckHeight() * 1.1, 
          this.deckWidth(), 
          this.deckHeight());
        noStroke();
      }
      image( this.image['player'+i.toString()], 
              this.deckWidth()*0.1, 
              height - i*this.deckHeight() * 1.1, 
              this.deckWidth(), 
              this.deckHeight());
      textSize(14);
      textAlign('left');
      text(channel, this.deckWidth()*0.1, height+5-this.deckHeight()*i*1.1);
      i++;
    }
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
      if (overlap(...me.tile[i].rectangle(), mouseX, mouseY)){
        me.tile[i].moving = true;
        me.moving.push(i);
      }
    }

    this.chat.bouton(); //check if we close or open chat

    //check if we press on the deck
    if (this.checkDeck('deck')) {
      if (this.hasFinished()) {
        this.activePlayer = false;
        this.client.transmitMove();
      } else {
        this.client.pickTile();
      }
    }

    //check if we press on sort777
    if (this.checkDeck('d777')) {
      this.rack.sort(compareTiles777);
    }

    //check if we press on sort678
    if (this.checkDeck('d678')) {
        this.rack.sort(compareTiles678);
    }
  }

  checkDeck(name){ //check if we clicked on the deck
    return overlap(...this.deckRectangle(name),mouseX, mouseY);
  }

  deckRectangle(name){
    return [this.deckX(), this.deckY(name), this.deckWidth(), this.deckHeight()];
  }

  // released mouse routine:

  drop(){ //drop and/or swap n with wherever it is
    for(let i = 0;  i < this.moving.length; i++){ 
      let n = this.moving[i];
      if (this.tile[n].grid == this.rack && overlap(...this.rack.rectangle(),...this.tile[n].center())){
        // internal move in our rack, server doesn't need to know
        this.rack.swap(n);
      }else if (this.activePlayer && overlap(...this.table.rectangle(),...this.tile[n].center())){
        // move from our rack or table to table, need to tell server
        this.hasMoved = true;
        this.table.swap(n);
        this.client.sendTile(this.tile[n]);
      }else{
        // put back the tile where it was, nothing to tell 
        this.tile[n].grid.putTile(n,this.tile[n].row,this.tile[n].col);
      }
      this.tile[n].moving = false;
    }
    this.moving = [];
  }
}


class BotPlayer extends Player{
  constructor(name, game) { // name has the form 'bot_1', 'bot_2'...
    super();
    this.game = game;
    this.client = new Client(this, name);
  }

  move() {
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
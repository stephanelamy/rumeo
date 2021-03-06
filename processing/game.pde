class Game{
  Tile[] tile;  
  IntList deck;
  ArrayList<RackGrid> rack; // array of RackGrid    set goes from 1-n  with ' and n = maximum tiles to be shown(default 20)
  TableGrid table;
  int nbPlayers;
  int ourID;
  IntList moving;
  PImage deckImage;
  PImage image777;
  PImage image678;
  int deckSize;
  
  Game(int nbPlayersD){
      tile = new Tile[2*4*13];
      createTiles();//cree toutes les tuiles avec des images JOKERS A AJOUTER PLUS TARD
      deck = new IntList();
      for (int i=0; i<tile.length; i++){
        deck.append(i);
      }
      table = new TableGrid(4,16, tile);
      nbPlayers = nbPlayersD;
      rack = new ArrayList<RackGrid>();
      for (int i = 0; i < nbPlayers; i++){
          rack.add(new RackGrid(2,10, tile));
      }
      ourID = 0;
      moving = new IntList();//list of moving tiles
      pickStartingTiles();
      deckImage = loadImage("png/tile_deck.png"); 
      image777 = loadImage("png/tile_777.png");
      image678 = loadImage("png/tile_678.png");
      deckSize = computeSize(10);
  }

  void pickOneTile(int noPlayer){
    if (deck.size() == 0){
      return;
    }
    int index = randomInteger(0, deck.size()-1); 
    int chosenNo = deck.get(index);
    deck.removeValue(chosenNo);
    rack.get(noPlayer).addTile(chosenNo);
    }

  void pickStartingTiles(){
    for (int i = 0; i < nbPlayers; i++){
      for (int j = 0; j < 14; j++){
        pickOneTile(i);
      }
    }
  }
  
  void createTiles(){
    //cree les tuiles
    for (int copie = 1; copie <= 2; copie++){
      for (int c = 1; c <= 4; c++){
        for (int n = 1; n <= 13 ; n++){
          int index = n - 1 + 13 * (c - 1) + 52 * (copie - 1);
          tile[index] = new Tile(c, n);
          tile[index].no = index; // chaque tuile connait son numero
        }
      }
    }
  }

  void drop(){//drop and/or swap n with wherever it is    
    for(int n : moving){ 
      if(overlap2(rack.get(ourID).rectangle(),tile[n].center())){
        rack.get(ourID).swap(n);
      }else if(overlap2(table.rectangle(),tile[n].center())){
        table.swap(n);
      }else{
        println("here");
        tile[n].grid.putTile(n,tile[n].row,tile[n].col);
      }
      tile[n].moving = false; // inutile ? putTile le fait deja en principe
    }
    moving.clear();
  }

  void checkMoving(){//update and draw moving tiles
    for(int n : moving){
      tile[n].x = mouseX; 
      tile[n].y = mouseY;
      tile[n].draw();
    }
  }

  boolean checkDeck(){//check if we clicked on the deck
    int[] point = {mouseX,mouseY};
    return overlap2(deckRectangle(), point);
  }
  
  boolean checkSort777(){//check if we clicked on sort777
    int[] point = {mouseX,mouseY};
    return overlap2(sort777Rectangle(), point);
  }
  
   boolean checkSort678(){//check if we clicked on sort678
    int[] point = {mouseX,mouseY};
    return overlap2(sort678Rectangle(), point);
  }

  int[] deckCoor(){//deck coor are stocked here in case we want to change them :P
    int deckWidth = computeSize(10);
    int deckHight = computeSize(10)*3/2;
    int deckX = (width + rack.get(ourID).cornerX() + rack.get(ourID).width() - deckWidth)/2;
    int deckY = rack.get(ourID).cornerY();
    int[] coor = {deckX, deckY, deckWidth, deckHight};
    return coor;
  }

  int[] deckRectangle(){
    return (new int[] {deckX(), deckY(), deckSize, deckSize*3/2} );
  }
  
  int[] sort777Rectangle(){
    int[] coor = {deckX(), deckY777(), deckSize, deckSize*3/2};
    return coor;
  }
  
   int[] sort678Rectangle(){
    int[] coor = {deckX(), deckY678(), deckSize, deckSize*3/2};
    return coor;
  }

  int deckX(){
    return int(width - deckSize*1.2);
  }

  int deckY(){
    return int(height - 3*deckSize*1.5*1.1);
  }
  
  int deckY777(){
    return int(deckY() + deckSize*1.5*1.1);
  }
  
  int deckY678(){
    return int(deckY() + 2*deckSize*1.5*1.1);
  }

  void drawDeck(){
    image(deckImage, deckX(), deckY(), deckSize, deckSize*3/2 );
    image(image777, deckX(), deckY777(), deckSize, deckSize*3/2);
    image(image678, deckX(), deckY678(), deckSize, deckSize*3/2 );
  }

  void textStatus(){
    boolean[] info = table.parse();
    String isCompletable = str(info[0]);
    String isValid = str(info[1]);
    String message = "Completable: " + isCompletable + "  Valid: " + isValid;
    textSize(32);
    textAlign(CENTER);
    text(message, width/2, 30);
  }

  void draw(){
    textStatus();
    drawDeck();
    table.draw();
    rack.get(ourID).draw();
    checkMoving();
  }
}
  

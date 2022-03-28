class Game{
  ArrayList<Tile> tile;  
  IntList deck;
  ArrayList<RackGrid> rack; // array of RackGrid    set goes from 1-n  with ' and n = maximum tiles to be shown(default 20)
  TableGrid table;
  int nbPlayers;
  int ourID;
  IntList moving;
  PImage deckImage;
  PImage image777;
  PImage image678;
  
  Game(int nbPlayersD){
      tile = new ArrayList<Tile>();
      createTiles();//cree toutes les tuiles avec des images JOKERS A AJOUTER PLUS TARD
      deck = new IntList();
      for (int i=0; i<tile.size(); i++){
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
      deckImage = loadImage("data/png/tile_deck.png"); // folder data or tiles seems to work as good ?
      image777 = loadImage("tiles/png/tile_777.png");
      image678 = loadImage("tiles/png/tile_678.png");
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
          tile.add(new Tile(c, n));
        }
      }
    }
  }

  void drop(){//drop and/or swap n with wherever it is
    for(int i = moving.size()-1;i>=0;i--){//go throught the list backwards so that if we delete a variable we don't cal 2 times
      int n = moving.get(i);
      if(overlap(rack.get(ourID).rectangle()[0],rack.get(ourID).rectangle()[1],rack.get(ourID).rectangle()[2],rack.get(ourID).rectangle()[3],tile.get(n).center().get(0),tile.get(n).center().get(1))){
        rack.get(ourID).swap(n);
      }else if(overlap(rack.get(ourID).rectangle()[0],rack.get(ourID).rectangle()[1],rack.get(ourID).rectangle()[2],rack.get(ourID).rectangle()[3],tile.get(n).center().get(0),tile.get(n).center().get(1))){
        table.swap(n);
      }else{
        tile.get(n).grid.putTile(n,tile.get(n).row,tile.get(n).col);
      }
      tile.get(n).moving = false;
    }
    moving.clear();
  }

  void checkMoving(){//update and draw moving tiles
    for(int no = 0;no < deck.size();no++){
      tile.get(deck.get(no)).x = mouseX; 
      tile.get(deck.get(no)).y = mouseY;
      tile.get(deck.get(no)).draw();
    }
  }

  boolean checkDeck(){//check if we clicked on the deck
    return overlap(deckRectangle()[0],deckRectangle()[1],deckRectangle()[2],deckRectangle()[3],mouseX,mouseY);
  }

  FloatList deckCoor(){//deck coor are stocked here in case we want to change them :P
    float deckWidth = computeSize(10);
    float deckHight = computeSize(10)*3/2;
    float deckX = (width + rack.get(ourID).cornerX() + rack.get(ourID).width() - deckWidth)/2;
    float deckY = float(rack.get(ourID).cornerY());
    FloatList coor = new FloatList();coor.append(deckX);coor.append(deckY);coor.append(deckWidth);coor.append(deckHight);
    return coor;
  }

  int deckSize(){
    return computeSize(10);
  }

  int[] deckRectangle(){
    int[] coor = {deckX(), deckY(), deckSize(), deckSize()*3/2};
    return coor;
  }

  int deckX(){
    return int(width - deckSize()*1.2);
  }

  int deckY(){
    return int(height - 4*deckSize()*(3/2)*1.1);
  }

  void drawDeck(){
    int size = deckSize();
    image(deckImage, deckX(), deckY(), size, size*3/2 );
    image(image777, deckX(), deckY() + size*(3/2)*1.1, size, size*3/2);
    image(image678, deckX(), deckY() + 2* size*(3/2)*1.1, size, size*3/2 );
  }

  void textStatus(){
    String isCompletable =table.parse().get(0);
    String isValid = table.parse().get(1);
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
  
// For the moment I don't consider jokers
// hand is an array of tile numbers

/*
void isPreSerie(IntList hand) {
  //  Tiles with the same number, and distinct colors
  PImage[] colorSet = new PImage[150];
  IntList numberSet = new IntList();
  for (int index;index< hand.length;index++) {
    colorSet[].add(tile[index].color);
    numberSet.append(tile[index].number);
  }
  return numberSet.size == 1 && colorSet.size == hand.length;
}

void isSerie(IntList hand) {
  // 3 or 4 tiles with the same number, and distinct colors
  return hand.length > 2 && isPreSerie(hand);
}

void isPresequence(IntList hand) {
  // all same color, with consecutive numbers
  const colorSet = new Set();
  const numberArray = [];
  for (const index of hand) {
    colorSet.add(tile[index].color);
    numberArray.push(tile[index].number);
  }
  return colorSet.size == 1 && hand.length == Math.max(...numberArray) - Math.min(...numberArray) + 1;
}

void isSequence(IntList hand) {
//   At least 3 tiles, all same color, with consecutive numbers
return hand.length > 2 && isPresequence(hand);
}

void isCombination(hand) {
  return isSerie(hand) || isSequence(hand);
}
*/

boolean isPreSerie(IntList hand) {

  return true;
}

boolean isSerie(IntList hand) {
  return true;
}

boolean isPresequence(IntList hand) {
  return true;
}

boolean isSequence(IntList hand) {
return true;
}

boolean isCombination(IntList hand){
  return true;
}
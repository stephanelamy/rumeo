import java.util.Collections;
//import java.util.*;
import java.util.HashMap; // for marginCoeff
import java.util.Comparator; // for sorting functions on Tile
import java.util.LinkedList; // for aux list in sorting
import java.util.ArrayList; //
import java.util.List; //
import java.util.Set; //
import java.util.HashSet; //

Game game;
boolean isServer = false;
boolean isClient = true;
String IPServer = "127.0.0.1";

// Meaningful CONSTANT names instead of values:
static final int EMPTY = -1;
static final int NONE = -2;


void setup() {//fonction speciale qui s'active une fois au debut
  fullScreen();
  game = new Game(1); // create a game with 1 player
  if(isServer){
    setupServer();
  }
  if(isClient){
    setupClient(IPServer);
  }
}

void draw() {//fonction speciale qui s'active 60 fois par second(ou moins si le programme est trop lourd)
  background(100);
  game.draw();
  if(isServer){
    connectServer();
  }
  if(isClient){
    connectClient();
  }
}

void mousePressed(){//fonction speciale qui s'active quand on click
  
  //check if we select a tile
  int[] point = {mouseX, mouseY};
  for(int i=0; i < game.tile.size(); i++){
    if(overlap2(game.tile.get(i).rectangle(), point)){
      game.tile.get(i).moving = true;
      game.moving.push(i);
    }
  }

  //check if we press on the deck
  if(game.checkDeck()){
    game.pickOneTile(game.ourID);
  }
  
  //check if we press on sort777
  if(game.checkSort777()){
    game.rack.get(game.ourID).sort("777");
  }
  
  //check if we press on sort678
  if(game.checkSort678()){
    game.rack.get(game.ourID).sort("678");
  }
  
}

void mouseReleased(){//fonction speciale qui s'active quand on relache
  game.drop();
}

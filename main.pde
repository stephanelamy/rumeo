Game game;

void setup() {//fonction special qui s'active une fois au debut
  fullScreen();
  game = new Game(1); // create a game with 1 player
}

void draw() {//fonction special qui s'active 60 fois par second(ou moins si le programme est trop lourd)
  background(100);
  game.draw();
}

void mousePressed(){//fonction speciale qui s'active quand on click

  //check if we select a tile
  for(int i=0; i < game.tile.size(); i++){
    if(overlap(game.tile.get(i).rectangle().get(0),game.tile.get(i).rectangle().get(1),game.tile.get(i).rectangle().get(2),game.tile.get(i).rectangle().get(3), mouseX, mouseY)){
      game.tile.get(i).moving = true;
      game.moving.push(i);
    }
  }

  //check if we press on the deck
  if(game.checkDeck()){
    game.pickOneTile(game.ourID);
  }
}

void mouseReleased(){//fonction speciale qui s'active quand on relache
  println("released");
  //game.drop();
}

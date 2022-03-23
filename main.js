let game;

function setup() {//fonction special qui s'active une fois au debut
  createCanvas(windowWidth, windowHeight);
  game = new Game(1);
}

function draw() {//fonction special qui s'active 60 fois par second(ou moins si le programme est trop lourd)
  background(100);
  // rect (200,200,100,100);
  game.draw();
}

function mousePressed(){//fonction speciale qui s'active quand on click
  console.log(game);

  //check if we select a tile
  for(let i=0; i < game.tile.length; i++){
    if(overlap(...game.tile[i].rectangle(), mouseX, mouseY)){
      game.tile[i].moving = true;
      game.moving.push(i);
    }
  }

  //check if we press on the deck
  if(game.checkDeck()){
    game.pickOneTile(game.ourID);
  }
}

function mouseReleased(){//fonction speciale qui s'active quand on relache
  game.drop();
}
let me;
let game;

function setup() {//fonction speciale qui s'active une fois au debut
  createCanvas(windowWidth, windowHeight);
  me = new HumanPlayer();
  game = new Game([me]);
}

function draw() {//fonction speciale qui s'active 60 fois par seconde (ou moins si le programme est trop lourd)
  background(100);
  me.draw();
  chat();
}

function mousePressed(){//fonction speciale qui s'active quand on click
<<<<<<< HEAD
  let click = me.mouseWasPressed();
  if (click == "pick_tile"){
    game.pickOneTile(me);
=======
  //console.log(game);

  //check if we select a tile
  for(let i=0; i < game.tile.length; i++){
    if(overlap(...game.tile[i].rectangle(), mouseX, mouseY)){
      game.tile[i].moving = true;
      game.moving.push(i);
    }
  }

  chatbouton();//to close or open chat

  //check if we press on the deck
  if(game.checkDeck()){
    game.pickOneTile(game.ourID);
  }

  //check if we press on sort777
  if(game.checkSort777()){
    game.rack[game.ourID].sort(compareTiles777);
  }

  //check if we press on sort678
  if(game.checkSort678()){
    game.rack[game.ourID].sort(compareTiles678);
>>>>>>> 2e4e2a17f4c101ddaa60a0652098ba2be66d4467
  }
}

function mouseReleased(){//fonction speciale qui s'active quand on relache
  me.drop();
}

function keyPressed(){
  clavierchat();
}

<<<<<<< HEAD
function mouseWheel(MouseEvent) {//bouge le chat
  chatscroll(MouseEvent);
}
=======
function mouseWheel(event) {//bouge le chat
  chatscroll(event);
}
>>>>>>> 2e4e2a17f4c101ddaa60a0652098ba2be66d4467

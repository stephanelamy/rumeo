let input,output;
let data = [];
let envoi = "";
let archive = [];



let mousewheel;
let textThickness = 30;//modifie le taille du text
let ecart = 4;// ecart verticale entre les text
let Xchat = 0, Ychat=0;//les coordonne haut gauche du chat
let gameXchat, gameYchat;//la hauteur/largeur du chat
let ourName = "Mrtnt";//nom du joueur

let Xboutonchat, Yboutonchat;//les coordonne haut gauche du bouton pour minimiser
let boutonsizechat;//hauteur/largeur du bouton
let checkboutonchat = false;
;

function chat(){
  //definire les variable ici
  Xchat = width/2;//les coordonne haut gauche du chat
  Ychat=0;//les coordonne haut gauche du chat
  gameXchat = width/2;//largeur du chat
  gameYchat = height/2;//hauteur du chat
  boutonsizechat = width/20;//taille du bouton du chat
  Xboutonchat = gameXchat - width/40 - boutonsizechat;//calcule la coordonne haut gauch du bouton
  Yboutonchat = width/40;//j'utilise width et non height pour la beauter
  //mantenant on affiche
  if(checkboutonchat){
    afficherarchive();//affiche tout les vieux message
    bardechat();//affiche ce qu'on ecrit
  }
  boutonchat();//affiche le bouton
  
}

function boutonchat(){
  circle(Xboutonchat+boutonsizechat/2+Xchat,Yboutonchat+boutonsizechat/2+Ychat,boutonsizechat);
}

function chatscroll(MouseEvent) {//bouge le chat
  mousewheel += MouseEvent.getCount()*10;//changer la valeur de defaut 10 pour la sensibiliter du mousewheel
  if (mousewheel > 0) {
    mousewheel = 0;
  }
  if (mousewheel < -(gameYchat-(textThickness+ecart)*4)) {
    mousewheel = -(gameYchat-(textThickness+ecart)*4);
  }
}

function bardechat() {//affiche ce qu'on ecrit 
  push();
  textAlign(LEFT, BOTTOM);
  textSize(textThickness);
  text(envoi, Xchat+(ecart*2), gameYchat-2);
  pop();
}

function afficherarchive() {//affiche tout les vieux message 
  push();
  fill(200, 200, 200);
  rect(Xchat+2, Ychat+2, gameXchat-4, gameYchat-4);//backgrond
  pop();
  push();
  translate(0, mousewheel);
  textAlign(LEFT, BOTTOM);
  for (let i = 0; i< archive.length; i++) {
    textSize(textThickness);
    text(archive[i], Xchat+(ecart*2), Ychat+gameYchat-25+-(archive.length*textThickness+ecart)+(i*textThickness+ecart));
  }
  pop();
}

function chatbouton(){
  if(abs((Xchat+Xboutonchat+boutonsizechat/2)-mouseX)< boutonsizechat/2 && abs((Ychat+Yboutonchat+boutonsizechat/2)-mouseY)<boutonsizechat/2){//pour un bouton rond
  //if(Xboutonchat < mouseX && Xboutonchat + boutonWidthchat > mouseX && Yboutonchat < mouseY && Yboutonchat + boutonHeightchat > mouseY ){//pour un bouton carre
    checkboutonchat = !checkboutonchat;
  }
}

function  clavierchat(){// a mettre dans key pressed

  if (keyCode == BACKSPACE){
    if (data.length>0) data.splice(data.length-1,1);
  }else{
    //there is an issue where CODED does not work so for now doing it the hard way    original code:  if (key != CODED && checkboutonchat){
    if (keyCode != BACKSPACE && keyCode != DELETE && keyCode !=  ENTER && keyCode !=  RETURN && keyCode !=  TAB && keyCode !=  ESCAPE && keyCode !=  SHIFT && keyCode !=  CONTROL && keyCode !=  OPTION && keyCode !=  ALT && keyCode !=  UP_ARROW && keyCode !=  DOWN_ARROW && keyCode !=  LEFT_ARROW && keyCode !=  RIGHT_ARROW && checkboutonchat){
      let charKey = key;
      data.push(charKey);
    }
  }

  envoi = join(data,"");
  if (keyCode == ENTER){
    if (envoi.length>1) archive.push(ourName +": "+ envoi);
    if(data[0] == "-"){//check for commands
      command(data);
    }
    data.splice(0, data.length)//clear the text
    envoi = "";
  }
}

function command(){//command will have a verity of uses especialy to start, modifie, connect and end games
  //take off the "-"
  let command;
  data.splice(0,1);
  command = join(data,"");
  //list of posible commands
  switch(command){
    case "tile":
      archive.push(game.tile);
    break;
    default:
      archive.push("this command is unknown");
  }
}
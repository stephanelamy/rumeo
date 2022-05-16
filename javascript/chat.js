class Chat{
  constructor(){
    this.input;
    this.output;
    this.data = [];
    this.envoi = "";
    this.archive = [];
    this.newMessage = 0;
    
    this.mousewheel;
    this.textThickness = 30; //modifie la taille du texte
    this.ecart = 4; // ecart vertical entre les textes
    this.Xchat = width/2, this.Ychat = 0; //les coordonnees haut gauche du chat
    this.gameXchat = width/2, this.gameYchat = height/2; //la hauteur/largeur du chat
    this.ourName = UUID; //nom du joueur
    
    this.boutonsizechat = width/20; //hauteur/largeur du bouton
    this.Xboutonchat = this.gameXchat - width/40 - this.boutonsizechat, this.Yboutonchat = width/40;
    //les coordonne haut gauche du bouton pour minimiser  //j'utilise width et non height pour la beaute
    this.checkboutonchat = false;;
  }

  draw(){
    push();
    this.drawBouton(); //affiche le bouton
    if(this.checkboutonchat){
      this.drawArchive(); //affiche tout les vieux messages
      this.bar(); //affiche ce qu'on ecrit
      this.newMessage = 0;
    } 
    pop();
  }

  drawBouton(){
    circle( this.Xboutonchat+this.boutonsizechat/2+this.Xchat,
            this.Yboutonchat+this.boutonsizechat/2+this.Ychat,
            this.boutonsizechat);
    text(this.newMessage,this.Xboutonchat+this.Xchat+this.boutonsizechat/2,this.Yboutonchat+this.Ychat+this.boutonsizechat*3/4);
  }

  scroll(event) {//bouge le chat
    //console.log(event);
    if(event.deltaY > 0){//if wheel is moving up
      this.mousewheel += 10;
    }else if(event.deltaY < 0){
      this.mousewheel -= 10; 
    }

    if (this.mousewheel > 0) {
      this.mousewheel = 0;
    }
    if (this.mousewheel < -(this.gameYchat-(this.textThickness+this.ecart)*4)) {
      this.mousewheel = -(this.gameYchat-(this.textThickness+this.ecart)*4);
    }
  }



  bar() {//affiche ce qu'on ecrit 
    push();
    textAlign(LEFT, BOTTOM);
    textSize(this.textThickness);
    text(this.envoi, this.Xchat+(this.ecart*2), this.gameYchat-2);
    pop();
  }
    
  drawArchive() {//affiche tous les vieux messages 
    push();
    fill(200, 200, 200);
    rect(this.Xchat+2, this.Ychat+2, this.gameXchat-4, this.gameYchat-4);//background
    pop();
    push();
    translate(0, this.mousewheel);
    textAlign(LEFT, BOTTOM);
    for (let i = 0; i< this.archive.length; i++) {
      textSize(this.textThickness);
      text(this.archive[i], this.Xchat+(this.ecart*2), 
        this.Ychat+this.gameYchat-25+-(this.archive.length*this.textThickness+this.ecart)+(i*this.textThickness+this.ecart));
    }
    pop();
  }
    
  bouton(){
    if( abs((this.Xchat+this.Xboutonchat+this.boutonsizechat/2)-mouseX)< this.boutonsizechat/2 && 
        abs((this.Ychat+this.Yboutonchat+this.boutonsizechat/2)-mouseY)<this.boutonsizechat/2){//pour un bouton rond
    //if(Xboutonchat < mouseX && Xboutonchat + boutonWidthchat > mouseX && Yboutonchat < mouseY && Yboutonchat + boutonHeightchat > mouseY ){//pour un bouton carre
        this.checkboutonchat = !(this.checkboutonchat);
    }
  }
    
  clavier(){// a mettre dans key pressed
    if (keyCode == BACKSPACE){
      if (this.data.length>0) this.data.splice(this.data.length-1,1);
    }else{
      //there is an issue where CODED does not work so for now doing it the hard way    original code:  if (key != CODED && checkboutonchat){
      if (keyCode != BACKSPACE && keyCode != DELETE && keyCode !=  ENTER && keyCode !=  RETURN && 
          keyCode !=  TAB && keyCode !=  ESCAPE && keyCode !=  SHIFT && keyCode !=  CONTROL && 
          keyCode !=  OPTION && keyCode !=  ALT && keyCode !=  UP_ARROW && keyCode !=  DOWN_ARROW && 
          keyCode !=  LEFT_ARROW && keyCode !=  RIGHT_ARROW && this.checkboutonchat){
        let charKey = key;
        this.data.push(charKey);
      }
    }
    this.envoi = join(this.data,"");
    if (keyCode == ENTER && this.data.length>0){
      // if (this.envoi.length>0) this.archive.push(this.ourName +": "+ this.envoi);
      if(this.data[0] == "-"){//check for commands
        command(this.data);
      }else{//if not send to server for others to see
        me.client.sendChat(this.data);
      }
      this.data.splice(0, this.data.length)//clear the text
      this.envoi = "";
    }else if (keyCode == ENTER){//close chat(if nothing writen)
      this.checkboutonchat = false;
    }
    if(key == "/"){//open chat
      this.checkboutonchat = true;
    }
  }

  addArchive(sent){
    if (sent.length>0){
      this.archive.push(this.ourName +": "+ sent);
      this.newMessage ++;
    }
  }
}



function command(data){//command will have a variety of uses especially to start, modify, connect and end games
  //take off the "-"
  let command;
  data.splice(0,1);
  command = join(data,"");
  //list of posible commands
  switch(command){
    case "tile":
      me.chat.archive.push(game.tile);
    break;

    case "send":
      me.client.sendChat(me.chat.archive);
    break;

    default:
      me.chat.archive.push("this command is unknown");
  }
}
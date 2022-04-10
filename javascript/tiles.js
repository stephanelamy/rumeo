class Tile{
  constructor(color,number) {
    this.color = color;//1-4, ('J' pour joker)
    this.number = number;//1-13 ('J' pour joker)
    this.x = 0;
    this.y = 0;
    this.row = 0; // 1-n
    this.col = 0; // calcul
    this.grid = this;
    this.size = 0;//his width    height=width/2*3
    this.image = loadImage(this.fileName()); // original image
    this.moving = false;
    this.no = 'none'; // index in game.tile[], for sorting purpose
    this.animation = false;
    this.animationStep = 60;
    this.animationCurrentStep = 0;
  }

  static computeSize(nbColumns) {
    return Math.min( 0.8*width / (Math.max(16, nbColumns)),
                     0.85*height / 6 * 2/3 );
  }

  fileName(){
    return "png/tile_"+this.number+"_"+this.color+".png";
  }

  setSize(cols){
    this.size = Tile.computeSize(cols);
  }
  
  draw() {
    image(this.image, this.x, this.y, this.size, this.size*3/2);
  }

  drawAnimation() {
    const millisecond =  millis();
    if(millisecond%100>1 &&this.animationCurrentStep < this.animationStep){
      this.animationCurrentStep++;
      //console.log(millisecond,millisecond%20>10,this.animationCurrentStep);
    }
    this.x = me.deckX()+(me.rack.findCoor(this.r,this.c)[0]-me.deckX())/this.animationStep*this.animationCurrentStep;
    this.y = me.deckY('deck')+(me.rack.findCoor(this.r,this.c)[1]-me.deckY('deck'))/this.animationStep*this.animationCurrentStep;
    image(this.image, this.x, this.y, this.size, this.size*3/2);

    if (this.animationCurrentStep >= this.animationStep){
      this.animation = false;
    }
  }

  center() {
    return [this.x + this.size/2, this.y + this.size*3/4];
  }

  rectangle() {
    return [this.x, this.y, this.size, this.size*3/2];
  }

  drawManualy(){
    //manual drawing
    let w = size;
    let h = size/2*3;
    push();
    fill(255,255,255);
    strokeWeight(2);
    rect(x,y,w,h);
    
    fill(255);
    textSize(size/2);
    let numberX = x+(w/2);//the middle of the tile
    let numberY = y+(h/2);
    textAlign(CENTER, CENTER);
    text(number,numberX,numberY); 
    pop();
  }

  startAnimation(startX,startY,endr,endc){
     this.animation = true;
     this.animationCurrentStep = 0;
     //this.animationRack = endRack;
     this.x = startX;
     this.y = startY;
     this.r = endr;
     this.c = endc;
  }
}



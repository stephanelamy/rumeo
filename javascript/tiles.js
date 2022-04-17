class Tile{
  constructor(color,number) {
    this.color = color;//1-4, ('J' pour joker)
    this.number = number;//1-13 ('J' pour joker)
    this.x = 0;
    this.y = 0;
    this.row = 0; // 1-n
    this.col = 0; // calcul
    this.grid = this;
    this.size = 0;//his width    height=width*1.5
    this.image = loadImage(this.fileName()); // original image
    this.moving = false; // moving with mouse
    this.no = 'none'; // index in game.tile[], for sorting purpose
    this.animation = false; // moving via animation
    this.animationStep = 0;
    this.animationCurrentStep = 0;
    this.animationStartX = 0;
    this.animationStartY = 0;
    this.animationEndX = 0;
    this.animationEndY = 0;
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
    this.x = this.animationStartX+(this.animationEndX-me.deckX())/this.animationStep*this.animationCurrentStep;
    this.y = this.animationStartY+(this.animationEndY-me.deckY('deck'))/this.animationStep*this.animationCurrentStep;
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

  startAnimation(startX,startY,endX,endY){
     this.animation = true;
     this.animationStep = 60;
     this.animationCurrentStep = 0;
     //this.animationRack = endRack;
     this.animationStartX = startX;
     this.animationStartY = startY;
     this.animationEndX = endX;
     this.animationEndY = endY;
  }
}



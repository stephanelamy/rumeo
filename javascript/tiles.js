class Tile{
  constructor(color, number, copie=1) {
    this.color = color; //1-4, ('J' for joker)
    this.number = number; //1-13 ('J' for joker)
    this.copie = copie; // for sorting purpose
    this.no = 'none'; // index in player.tile[], for sorting purpose
    this.x = 0;
    this.y = 0;
    this.row = 0; // row of the grid, if any
    this.col = 0; // idem for column
    this.grid = 0; // OBSOLETE ??
    this.size = 0; //his width    height=width*1.5
    this.image = loadImage(this.fileName()); // original image
    this.moving = false; // moving with mouse
    this.animation = {
      ongoing: false,
      steps: 0,
      currentStep: 0,
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0
    }
  }

  static computeSize(nbColumns) {
    return Math.min( 0.8*width / (Math.max(16, nbColumns)),
                     0.85*height / 6 * 2/3 );
  }

  fileName(){
    return "png/tile_" + this.number + "_" + this.color + ".png";
  }

  setSize(cols, coeff=1){
    this.size = Tile.computeSize(cols) * coeff;
  }
  
  draw() {
    image(this.image, this.x, this.y, this.size, this.size*1.5);
  }

  drawAnimation() {
    const millisecond =  millis();
    if(millisecond%100>1 && this.animation.currentStep < this.animation.steps) {
      this.animation.currentStep++;
    }
    let t = this.animation.currentStep / this.animation.steps;
    // alternative way with time only:
    t = (millisecond - this.animation.startTime) / this.animation.duration;
    t = min(t,1);
    this.x = this.animation.startX+(this.animation.endX-this.animation.startX)*t;
    this.y = this.animation.startY+(this.animation.endY-this.animation.startY)*t;
    image(this.image, this.x, this.y, this.size, this.size*3/2);
    if (t == 1){
      this.animation.ongoing = false;
    }
  }

  center() {
    return [this.x + this.size/2, this.y + this.size*3/4];
  }

  rectangle() {
    return [this.x, this.y, this.size, this.size*3/2];
  }

  startAnimation(steps) { //start or restart a animation
    this.animation.ongoing = true;
    this.animation.startTime = millis();
    this.animation.duration = 1000;
    this.animation.steps = steps;
    this.animation.currentStep = 0;
  }

  startAnimationV(startX, startY, endX, endY) { //same but if we already know start/end
    this.giveAnimationStart(startX,startY);
    this.giveAnimationEnd(endX,endY);
    this.startAnimation(50);
  }

  giveAnimationStart(startX, startY) {
    this.animation.startX = startX;
    this.animation.startY = startY;
 }

  giveAnimationEnd(endX, endY) {
    this.animation.endX = endX;
    this.animation.endY = endY;
 }

}



class Grid{
  //console.log("im here");
  constructor(r, c, tileArray){
      this.rows = r; // number of rows
      this.cols = c; // number of columns
      this.place = []; // used as this.place[row,column]
      for(let i = 0; i < this.rows; i++){
        let row = [];
        for(let j = 0; j < this.cols; j++){
          row.push('empty');
        }
        this.place.push(row);
      }
      this.tile = tileArray; // pas besoin de passer game en entier, on a juste besoin des tuiles
      this.size = drawnTile.computeSize(this.cols);//width of a tile
      this.margin = { "row": this.size * -0.3, // vertical space between rows 
                      "top": this.size * 0.1, 
                      "bottom": this.size * 0.1, 
                      "left": this.size * 0.1, 
                      "right": this.size * 0.1 };
      this.color = [0,0,0];
  }

  cornerX(){
    return 0;
  }

  cornerY(){
    return 0;
  }

  width(){
    return this.cols*this.size + this.margin.right + this.margin.left;
  }

  height(){
    return this.rows*(this.size*3/2+this.margin.row) + this.margin.row + this.margin.top + this.margin.bottom;
  }

  isThereTile(n){//find if tile n is in this grid // bizarre ?
    for(let r = 0; r < this.rows; r++){
      for(let c = 0; c < this.cols; c++){
        if(this.place[r][c]  == n){
          return true;
        }
      }
    }
    return false;
  }

  findEmptySpot(){
    for(let r = 0; r < this.rows; r++){
      for(let c = 0; c < this.cols; c++){
        if(this.place[r][c]  == 'empty'){
          return [r,c];
        }
      }
    }
    return 'full';
  }

  isFull() {
    return this.findEmptySpot() == 'full';
  }

  putTile(n, r, c){
    this.place[r][c] = n;
    const [x, y] = this.findCoor(r,c);
    let tile = this.tile[n];
    tile.row = r;
    tile.col = c;
    tile.x = x;
    tile.y = y;
    tile.moving = false;
    tile.position = this.name;
  }

  addTile(n){//find the first empty space
    let [r,c] = this.findEmptySpot();
    this.putTile(n,r,c);
  }

  extend(n){ // add n columns to the grid
    this.cols += n;
    for(const row of this.place){
      while (row.length < this.cols) {
        row.push('empty');
      }
    }
    for(let r = 0; r < this.rows; r++){
      for(let c = 0; c < this.cols; c++){
        let tile = this.tile[this.place[r][c]];
        console.log(tile);
      }
    }
  }

  drawBackground(){
    const rackW = this.cols*this.size + this.margin.left + this.margin.right;//to compute
    const rackH = this.rows*(this.size*3/2+this.margin.row) - this.margin.row 
      + this.margin.top + this.margin.bottom;
    push();//draw rack background
    fill(...this.color);
    rect(this.cornerX(),this.cornerY(),rackW,rackH);
    pop();
  }

  draw(){     
    this.drawBackground();

    let movingTile = 'None';
    for(let row=0; row<this.place.length; row++){
      for(let col=0; col<this.place[row].length; col++){

        const t = this.place[row][col];//identity of the tile in question
  
        //draw all tiles on the rack
        if(t != 'empty'){  
          const tile = this.tile[t];//tile in question
          if(tile.moving){
            movingTile = tile;
          }else{
            tile.draw();
          }
        }
      }

      //draw the tile that is moving
      if(movingTile != 'None'){
        let Twidth = movingTile.size;
        let Theight = movingTile.size*3/2;
        //tiles
        movingTile.image.resize(Twidth,Theight);
        image(movingTile.image,movingTile.x,movingTile.y);//resize and draw the image into a rect
      }

    }
  }

  swap(n){//swap tile[n] with the tile it was droped on tile(t)(if posible)
    let rn = this.tile[n].row; 
    let cn = this.tile[n].col; 
    // top left corner:
    let [xn, yn] = this.tile[n].center();
    let t = 'none';
    loop:
    for(let row=0; row<this.rows; row++){
      for(let col=0; col<this.cols; col++){
        //find where we are on the rack
        let [x, y] = this.findCoor(row,col);
        // WE ONLY LOOK WHERE IS THE CENTER OF THE TILE 
        if(overlap(x, y, this.size, this.size*3/2, xn, yn)){
          t = this.place[row][col]; //value of the tile to replace
          this.putTile(n,row,col);
          break loop;
        }
      }
    }
    if (t == 'none'){
      this.putTile(n,rn,cn); // retour à la place initiale
    } else if (t == 'empty'){
      this.place[rn][cn] = "empty"; // place initiale devient vide
    } else {
      this.putTile(t,rn,cn); // place initiale prend la tuile t
    }
}

  findCoor(r,c){//to know coordinate of 'empty' tile
    let x = this.cornerX() + c*this.size + this.margin.left;
    let y = this.cornerY() + r*(this.size*3/2+this.margin.row) +this.margin.top;
    return [x,y];
  }
}

class RackGrid extends Grid{
  constructor(rows,cols,tileArray,name){
    super(rows,cols,tileArray);
    this.name = name;//to know whos player gride this is    (1-4)
    this.color = [139,69,19];
    this.margin.row =  this.size * -0.3;
  } 

  cornerX(){
    return width/2 - this.cols*this.size/2 - this.margin.right - this.margin.left;
  }

  cornerY(){
    return height - this.rows*(this.size*3/2+this.margin.row) + this.margin.row 
      - this.margin.top - this.margin.bottom;
  }

}

class TableGrid extends Grid{
  constructor(rows,cols,tileArray,name){
    super(rows,cols,tileArray);
    this.name = name;//to know that this is the table    (-1)
    this.color = [0,100,0];
    this.margin.row =  this.size * 0.3;
  } 

  cornerX(){
    return width/2 - this.cols*this.size/2 - this.margin.right - this.margin.left;
  }

  cornerY(){
    return 0;
  }

}

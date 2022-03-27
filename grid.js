class Grid{
  constructor(rows, cols, tileArray){
      this.rows = rows; // number of rows
      this.cols = cols; // number of columns
      this.place = []; // used as this.place[row,column]
      for(let i = 0; i < this.rows; i++){
        let row = [];
        for(let j = 0; j < this.cols; j++){
          row.push('empty');
        }
        this.place.push(row);
      }
      this.tile = tileArray; // pas besoin de passer game en entier, on a juste besoin des tuiles
      this.size = Tile.computeSize(this.cols);//width of a tile
      this.marginCoeff = { "row":  -0.3, // vertical space between rows 
                      "top":  0.1, 
                      "bottom":  0.1, 
                      "left":  0.1, 
                      "right":  0.1 };
      this.color = [0,0,0];
  }

  margin(name){
    return this.marginCoeff[name] * this.size;
  }

  cornerX(){
    return 0;
  }

  cornerY(){
    return 0;
  }

  width(){
    return this.cols*this.size +  this.margin('right') +  this.margin('left');
  }

  height(){
    return this.rows*(this.size*3/2+ this.margin('row')) -  this.margin('row') +  this.margin('top') +  this.margin('bottom');
  }

  rectangle(){
    return [this.cornerX(), this.cornerY(), this.width(), this.height()];
  }

  findCoor(r,c){//to know coordinate of 'empty' tile
    let x = this.cornerX() + c*this.size +  this.margin('left');
    let y = this.cornerY() + r*(this.size*3/2+ this.margin('row')) + this.margin('top');
    return [x,y];
  }

  //find if tile n is in this grid // bizarre ?
  isThereTile(n){
    for(let r = 0; r < this.rows; r++){
      for(let c = 0; c < this.cols; c++){
        if(this.place[r][c]  == n){
          return true;
        }
      }
    }
    return false;
  }

  //find the first empty space
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
    let tile = this.tile[n];
    tile.setSize(this.cols);
    tile.grid = this;
    this.tile[n].grid.place[r][c] = n;
    const [x, y] = this.findCoor(r,c);
    tile.row = r;
    tile.col = c;
    tile.x = x;
    tile.y = y;
    tile.moving = false;
  }

  addTile(n){
    if (this.isFull()){
      this.extend(2);
    }
    let [r,c] = this.findEmptySpot();
    this.putTile(n,r,c);
  }

  // add n columns to the grid
  extend(n){ 
    if ( (this.cols == 26 && this.rows == 3) ||
         (this.cols == 22 && this.rows == 2) ) {
      this.rows += 1;
      this.place.push([]);
    } else {
      this.cols += n;
    }
    this.size = Tile.computeSize(this.cols);
    for(const row of this.place){
      while (row.length < this.cols) {
        row.push('empty');
      }
    }
    for(let r = 0; r < this.rows; r++){
      for(let c = 0; c < this.cols; c++){
        const n = this.place[r][c];
        if (n != 'empty'){
          this.putTile(n, r, c);
        }
      }
    }
  }

  drawBackground(){
    push();//draw rack background
    fill(...this.color);
    rect(...this.rectangle());
    pop();
  }

  draw(){     
    this.drawBackground();
    for(let row=0; row<this.rows; row++){
      for(let col=0; col<this.cols; col++){
        const t = this.place[row][col];//identity of the tile in question
  
        //draw all tiles on the rack, skiping moving ones
        if(t != 'empty'){  
          const tile = this.tile[t];//tile in question
          if(!tile.moving){
            tile.draw();
          }
        }
      }
    }
  }

  findSelectedTile(){ //find tile under mouse
    for(let row=0; row<this.rows; row++){
      for(let col=0; col<this.cols; col++){
        let [x, y] = this.findCoor(row,col);
        if(overlap(x, y, this.size, this.size*3/2, mouseX + this.size/2, mouseY + this.size*3/4)){
          return [row,col];
        }
      }
    }
    return 'none';
  }
  
    //the swap plan

    //1 see on what tile were overlaping(and where)
    //2 if empty replace
    //3 look if empty further out in the row(right or left) if so replace
    //4 otherwise take the last tile on the row(right) and move it down one col 3
    //5 lastly if no space on the board extend then replace
    //
  swap(n){//swap tile[n] with the tile it was droped on tile(t)(if posible)
    // SHOULD change the name of this function, it does'n swap anymore...

    let rn = this.tile[n].row; 
    let cn = this.tile[n].col; 

    //info on t
    let rt;
    let ct;
    let t = 'none';

    if(this.findSelectedTile() != 'none'){
      [rt,ct] = this.findSelectedTile();
      t = this.place[rt][ct];
    }

    if (t == 'none'){//si on n'est pas au dessus d'un case 
      this.tile[n].grid.putTile(n,rn,cn);
    }else if (t == 'empty'){//si on peut juste remplacer
      this.tile[n].grid.place[rn][cn] = 'empty';
      this.putTile(n,rt,ct);
    } else {
      if(this.isFull()){
        this.extend(1);
      }
      this.tile[n].grid.place[rn][cn] = 'empty';
      this.place[rt][ct] = 'empty';

      this.putTile(n,rt,ct);
      // ATTENTION AU CAS n == t !!!
      if (t != n){
        let [emptyR,emptyC] = this.findEmptySpot();
        this.putTile(t,emptyR,emptyC);
      }
    }
  }
}

class RackGrid extends Grid{
  constructor(rows,cols,tileArray){
    super(rows,cols,tileArray);
    this.color = [139,69,19];
    this.marginCoeff.row = -0.3;
  } 

  cornerX(){
    return width/2 - this.cols*this.size/2 -  this.margin('right') -  this.margin('left');
  }

  cornerY(){
    return height - this.rows*(this.size*3/2+ this.margin('row')) +  this.margin('row') 
      -  this.margin('top') -  this.margin('bottom');
  }

  reset(){
    for(let row=0; row<this.rows; row++){
      for(let col=0; col<this.cols; col++){
        this.place[row][col] = 'empty';
      }
    }
  }

  sort(sortFunction){
    let auxArray = [];
    for(let row=0; row<this.rows; row++){
      for(let col=0; col<this.cols; col++){
        const n = this.place[row][col];
        if (n != 'empty'){
          auxArray.push(this.tile[n]);
        }
      }
    }
    auxArray.sort(sortFunction);
    this.reset();
    for(let row=0; row<this.rows; row++){
      for(let col=0; col<this.cols; col++){
        if (auxArray.length > 0){
          const tile = auxArray.pop();
          this.putTile(tile.no,row,col);
        }
      }
    }
  }

}
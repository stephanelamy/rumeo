class Grid{
  int rows, cols; 
  int maxrows, maxcols;
  int[][] place;
  List<Tile> tile;
  int size;
  color colour;
  HashMap<String, Float> marginCoeff = new HashMap<String, Float>();
  
  Grid(int rD, int cD, ArrayList<Tile> tileArray){
      rows = rD; // current number of rows
      cols = cD; // current number of columns 
      setMaxs();
      place = new int[maxrows][maxcols];
      for(int i = 0; i < maxrows; i++){ 
        for(int j = 0; j < maxcols; j++){
          place[i][j] = EMPTY;
        }
      }
      tile = tileArray; // pas besoin de passer game en entier, on a juste besoin des tuiles
      size = computeSize(cols); //width of a tile
      colour = color(0,0,0);
      marginCoeff.put("row",  0.0);
      marginCoeff.put("top",  0.1);
      marginCoeff.put("bottom",  0.1);
      marginCoeff.put("left",  0.1);
      marginCoeff.put("right",  0.1);
  }

  void setMaxs(){
    maxrows = 4;
    maxcols = 26;
  }

  int margin(String name){
   return int(size * marginCoeff.get(name));
  }

  int cornerX(){
    return 1;
  }

  int cornerY(){
    return 1;
  }

  int width(){
    return int(cols * size +  margin("right") +  margin("left"));
  }

  int height(){
    return int( rows * ( size*1.5 + margin("row") ) -  margin("row") +  margin("top") +  margin("bottom") );
  }

  int[] rectangle(){
    return ( new int[] {cornerX(), cornerY(), width(), height()} );
  }

  int[] findCoor(int r,int c){//to know coordinate of a tile
    int x = cornerX() + c*size +  margin("left");
    int y = cornerY() + r*(size*3/2+ margin("row")) + margin("top");
    return (new int[]  {x, y, size, size*3/2} );
  }

  //find if tile n is in this grid // bizarre ?
  boolean isThereTile(int n){
    for(int r = 0; r < rows; r++){
      for(int c = 0; c < cols; c++){
        if(place[r][c] == n){
          return true;
        }
      }
    }
    return false;
  }

  //find the first empty space
  int[] findEmptySpot(){
    for(int r = 0; r < rows; r++){
      for(int c = 0; c < cols; c++){
        if(place[r][c]  == EMPTY){
          return (new int[] {r, c} );
        }
      }
    }
    return (new int[] {EMPTY});
  }

  boolean isFull() {
    return findEmptySpot()[0] == EMPTY;
  }

  void putTile(int n, int r, int c){
    place[r][c] = n;
    tile.get(n).setSize(cols);
    tile.get(n).grid = this;
    tile.get(n).row = r;
    tile.get(n).col = c;
    tile.get(n).x = findCoor(r,c)[0];
    tile.get(n).y = findCoor(r,c)[1];
    tile.get(n).moving = false;
  }

  void addTile(int n){
    if (isFull()){
      extend();
    }
    int[] empty = findEmptySpot();
    putTile(n, empty[0], empty[1]);
  }

  void resetRow(int r){
    for (int c = 0; c < cols; c++){
      place[r][c] = EMPTY;
    }
  }

  // extend the grid
  void extend(){    
    if ( (cols == 26 && rows == 3) ||
         (cols == 22 && rows == 2) ) {
      resetRow(rows);
      rows += 1;
    } else {
      cols += 2;
    }
    size = computeSize(cols);
    
    for(int r = 0; r < rows; r++){
      for(int c = 0; c < cols; c++){
        int N = place[r][c];
        if (N != EMPTY){
          putTile(N, r, c);
        }
      }
    }
  }

  void drawBackground(){
    push();//draw rack background
    fill(colour);
    rect(cornerX(), cornerY(), width(), height());
    pop();
  }

  void draw(){     
    drawBackground();
    for(int row=0; row<rows; row++){
      for(int col=0; col<cols; col++){
        int t = place[row][col];//identity of the tile in question
  
        //draw all tiles on the rack, skiping moving ones
        if(t != EMPTY){  
          if(!tile.get(t).moving){
            tile.get(t).draw();
          }
        }
      }
    }
  }

  int[] findSelectedTile(){ //find tile under mouse
    for(int row=0; row<rows; row++){
      for(int col=0; col<cols; col++){
        int[] point = {mouseX + size/2, mouseY + size*3/4};
        if(overlap2(findCoor(row,col), point)){
          return (new int[] {row, col});
        }
      }
    }
    return (new int[] {NONE} );
  }
  
    //the swap plan

    //1 see on what tile were overlaping(and where)
    //2 if empty replace
    //3 look if empty further out in the row(right or left) if so replace
    //4 otherwise take the last tile on the row(right) and move it down one col 3
    //5 lastly if no space on the board extend then replace
    //
  void swap(int n){//swap tile.get(n) with the tile it was droped on tile(t)(if posible)
    // SHOULD change the name of this function, it does'n swap anymore...
    
    int rn = tile.get(n).row; 
    int cn = tile.get(n).col; 

    //info on t
    int rt = 0;
    int ct = 0;
    int t = NONE;
    
    int[] findt = findSelectedTile();
    if(findt[0] != NONE){
      rt = findt[0];
      ct = findt[1];
      t = place[rt][ct];
    }
    
    if (t == NONE){//si on n'est pas au dessus d'une case 
      tile.get(n).grid.putTile(n,rn,cn);
    }else if (t == EMPTY){//si on peut juste remplacer
      tile.get(n).grid.place[rn][cn] = EMPTY;
      putTile(n,rt,ct);
    } else {
      if(isFull()){
        extend();
      }
      tile.get(n).grid.place[rn][cn] = EMPTY;
      place[rt][ct] = EMPTY;

      putTile(n,rt,ct);
      // ATTENTION AU CAS n == t !!!
      if (t != n){
        putTile(t,findEmptySpot()[0],findEmptySpot()[1]);
      }
    }
  }
}

class RackGrid extends Grid{
  RackGrid(int rows,int cols,ArrayList<Tile> tileArray){
    super(rows,cols,tileArray);
    colour = color(139,69,19);
    marginCoeff.put("row", -0.3);
  } 

  void setMaxs(){
    maxrows = 4;
    maxcols = 26;
  }

  int cornerX(){
    return int(width/2 - cols*size/2 -  margin("right") -  margin("left"));
  }

  int cornerY(){
    return int(height - rows*(size*3/2+ margin("row")) +  margin("row") 
      -  margin("top") -  margin("bottom"));
  }

  void reset(){
    for(int row=0; row<rows; row++){
      for(int col=0; col<cols; col++){
        place[row][col] = EMPTY;
      }
    }
  }

  void sort(String sortOption){
    LinkedList<Tile> aux = new LinkedList<>(); 
    for(int row=0; row < rows; row++){
      for(int col=0; col < cols; col++){
        int n = place[row][col];
        if (n != EMPTY){
          aux.add(tile.get(n));
        }
      }
    }
    if (sortOption == "777") {
      Collections.sort(aux, Comparator.comparing(Tile::sort777));
    }
    if (sortOption == "678") {
      Collections.sort(aux, Comparator.comparing(Tile::sort678));
    }
    reset();
    for(int row = 0; row < rows; row++){
      for(int col = 0; col < cols; col++){
        if (aux.size() > 0){
          Tile tile = aux.pollFirst();
          putTile(tile.no, row, col);
        }
      }
    }
  }

}

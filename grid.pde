import java.util.HashMap; // import the HashMap class
import java.util.Comparator;
import java.util.LinkedList;
import java.util.ArrayList;

class Grid{
  int rows, cols;
  ArrayList<ArrayList<Integer>> place = new ArrayList<>();
  ArrayList<Tile> tile;
  int size;
  color thiscolor;
  HashMap<String, Float> marginCoeff = new HashMap<String, Float>();
  
  Grid(int rD, int cD, ArrayList<Tile> tileArray){
      rows = rD; // number of rows
      cols = cD; // number of columns 
      for(int i = 0; i < rows; i++){
        ArrayList<Integer> row = new ArrayList<>(); 
        for(int j = 0; j < cols; j++){
          row.add(-1);
        }
        place.add(row);
      }
      tile = tileArray; // pas besoin de passer game en entier, on a juste besoin des tuiles
      size = computeSize(cols); //width of a tile
      thiscolor = color(0,0,0);
      marginCoeff.put("row",  0.0);
      marginCoeff.put("top",  0.1);
      marginCoeff.put("bottom",  0.1);
      marginCoeff.put("left",  0.1);
      marginCoeff.put("right",  0.1);
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
    return int(cols*size +  margin("right") +  margin("left"));
  }

  int height(){
    return int(rows*(size*3/2+ margin("row")) -  margin("row") +  margin("top") +  margin("bottom"));
  }

  int[] rectangle(){
    int[] data = {cornerX(), cornerY(), width(), height()};
    return data;
  }

  int[] findCoor(int r,int c){//to know coordinate of a tile
    int x = cornerX() + c*size +  margin("left");
    int y = cornerY() + r*(size*3/2+ margin("row")) + margin("top");
    int[] data = {x, y, size, size*3/2};
    return data;
  }

  //find if tile n is in this grid // bizarre ?
  boolean isThereTile(int n){
    for(int r = 0; r < rows; r++){
      for(int c = 0; c < cols; c++){
        if(place.get(r).get(c) == n){
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
        if(place.get(r).get(c)  == -1){
          int[] data = {r, c};
          return data;
        }
      }
    }
    int[] data = {-1};
    return data;
  }

  boolean isFull() {
    return findEmptySpot()[0] == -1;
  }

  void putTile(int n, int r, int c){
    place.get(r).set(c, n);
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

  // add n columns to the grid
  void extend(){    
    if ( (cols == 26 && rows == 3) ||
         (cols == 22 && rows == 2) ) {
      rows += 1;
      place.add(new ArrayList<Integer>());
    } else {
      cols += 2;
    }
    size = computeSize(cols);
    
    for(int row = 0; row < rows; row++){
      while (place.get(row).size() < cols) {
        place.get(row).add(-1);
      }
    }
    
    for(int r = 0; r < rows; r++){
      for(int c = 0; c < cols; c++){
        int N = place.get(r).get(c);
        if (N != -1){
          putTile(N, r, c);
        }
      }
    }
  }

  void drawBackground(){
    push();//draw rack background
    fill(thiscolor);
    rect(cornerX(), cornerY(), width(), height());
    pop();
  }

  void draw(){     
    drawBackground();
    for(int row=0; row<rows; row++){
      for(int col=0; col<cols; col++){
        int t = place.get(row).get(col);//identity of the tile in question
  
        //draw all tiles on the rack, skiping moving ones
        if(t != -1){  
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
          int[] data = {row, col};
          return data;
        }
      }
    }
    int[] data = {-2}; // pourquoi pas -1 ?
    return data;
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
    int t = -2;//-2 is "none"  -1 is "empty"
    
    int[] findt = findSelectedTile();
    if(findt[0] != -2){
      rt = findt[0];
      ct = findt[1];
      t = place.get(rt).get(ct);
    }
    
    if (t == -2){//si on n'est pas au dessus d'une case 
      tile.get(n).grid.putTile(n,rn,cn);
    }else if (t == -1){//si on peut juste remplacer
      tile.get(n).grid.place.get(rn).set(cn, -1);
      putTile(n,rt,ct);
    } else {
      if(isFull()){
        extend();
      }
      tile.get(n).grid.place.get(rn).set(cn, -1);
      place.get(rt).set(ct, -1);

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
    thiscolor = color(139,69,19);
    marginCoeff.put("row", -0.3);
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
        place.get(row).set(col, -1);
      }
    }
  }

  void sort(String sortOption){
    LinkedList<Tile> aux = new LinkedList<>(); 
    for(int row=0; row < rows; row++){
      for(int col=0; col < cols; col++){
        int n = place.get(row).get(col);
        if (n != -1){
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

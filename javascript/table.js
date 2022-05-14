class TableGrid extends Grid{
  constructor(rows, cols, tileArray){
    super(rows,cols,tileArray);
    this.color = [0,100,0];
    this.marginCoeff.row = 0.3;
    this.filter = new Filter(this.tile);
  } 

  cornerX(){
    return width/2 - this.cols*this.size/2 -  this.margin('right') -  this.margin('left');
  }

  cornerY(){
  return 40;
  }
  
  parse(){
    // return an array of groups (of contiguous tiles) on table
    const result = [];
    for (let row=0; row < this.rows; row++){
      let currentGroup = [];
      for (let col=0; col < this.cols; col++){
        if (this.place[row][col] == 'empty' || col == this.cols - 1){
          if (currentGroup.length > 0){
            result.push(currentGroup);
            currentGroup = [];
          }
        } else {
          currentGroup.push(this.place[row][col]);
        }
      }
    }
    return result;
  }

  status(){
    let isCompletable = true;
    let isValid = true;
    const groups = this.parse();
    for (const group of groups){
      isCompletable = isCompletable && this.filter.isPreCombination(group);
      isValid = isValid && this.filter.isCombination(group);
    } 
    return [isCompletable, isValid];
  }

}

  
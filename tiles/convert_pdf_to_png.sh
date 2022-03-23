#!/bin/bash

convert -density 250 -crop '99%x99%+1+1' -transparent white -fuzz 2% all_tiles_serie3.pdf[0] png/tile_J_1.png
convert -density 250 -crop '99%x99%+1+1' -transparent white -fuzz 2% all_tiles_serie3.pdf[1] png/tile_J_2.png

for ((number=1; number<=13; number++))
do
  for ((color=1; color<=4; color++))
  do
    let index=($number-1)*4+$color+1
    filenamepdf="all_tiles_serie3.pdf[$index]"
    sep="_"
    filenamepng="png/tile_$number$sep$color.png"
    convert -quality 100 -density 250 -crop '99%x99%+1+1' -transparent white -fuzz 2% $filenamepdf $filenamepng
  done
done


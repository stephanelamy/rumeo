#!/bin/bash

convert -density 250 all_tiles_serie2.pdf[0] jpg/tile_J_1.jpg
convert -density 250 all_tiles_serie2.pdf[1] jpg/tile_J_2.jpg

for ((color=1; color<=4; color++))
do
  for ((number=1; number<=13; number++))
  do
  let index=($number-1)*4+$color+1
  filenamepdf="all_tiles_serie2.pdf[$index]"
  sep="_"
  filenamejpg="jpg/tile_$number$sep$color.jpg"
  echo $filenamejpg
  convert -density 250 $filenamepdf $filenamejpg
  done
done


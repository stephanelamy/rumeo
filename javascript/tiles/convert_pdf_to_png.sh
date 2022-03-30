#!/bin/bash

convertoptions="-quality 100 -density 250 -crop 99%x99%+1+1 -transparent white -fuzz 2%" 

echo "converting with options $convertoptions..."

convert $convertoptions all_tiles.pdf[0] png/tile_777.png
convert $convertoptions all_tiles.pdf[1] png/tile_678.png
convert $convertoptions all_tiles.pdf[2] png/tile_deck.png
convert $convertoptions all_tiles.pdf[3] png/tile_J_1.png
convert $convertoptions all_tiles.pdf[4] png/tile_J_2.png

for ((number=1; number<=13; number++))
do
  for ((color=1; color<=4; color++))
  do
    let index=($number-1)*4+$color+4
    filenamepdf="all_tiles.pdf[$index]"
    sep="_"
    filenamepng="png/tile_$number$sep$color.png"
    convert $convertoptions $filenamepdf $filenamepng
  done
done

echo "done."

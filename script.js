
var rows = 4;
var columns = 4;

var currTile;
var otherTile; //blank tile

var turns = 0;

var words = ["A", "M", "O", "R", "C", "A", "M", "A", "B", "O", "L", "A", "A", "S", "A"];

const shuffle = (array) => { 
    for (let i = array.length - 1; i > 0; i--) { 
      const j = Math.floor(Math.random() * (i + 1)); 
      [array[i], array[j]] = [array[j], array[i]]; 
    } 
    return array; 
}; 

var wordsShuffled = shuffle(words);
wordsShuffled.push(" ");

var imgOrder = wordsShuffled;

window.onload = function() {
    for (let r=0; r < rows; r++) {
        for (let c=0; c < columns; c++) {

            //<img id="0-0" src="1.jpg">
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.innerHTML = imgOrder.shift();
            tile.draggable = "true";

            //DRAG FUNCTIONALITY
            tile.addEventListener("dragstart", dragStart);  //click an image to drag
            tile.addEventListener("dragover", dragOver);    //moving image around while clicked
            tile.addEventListener("dragenter", dragEnter);  //dragging image onto another one
            tile.addEventListener("dragleave", dragLeave);  //dragged image leaving anohter image
            tile.addEventListener("drop", dragDrop);        //drag an image over another image, drop the image
            tile.addEventListener("dragend", dragEnd);      //after drag drop, swap the two tiles
            tile.addEventListener("click", clickAction);      //swap tiles if the blank one is adjacent

            document.getElementById("board").append(tile);

        }
    }
}

function dragStart() {
    currTile = this; //this refers to the img tile being dragged
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {

}

function dragDrop() {
    otherTile = this; //this refers to the img tile being dropped on
}

function clickAction () {

    currTile = this;
    let currCoords = currTile.id.split("-"); //ex) "0-0" -> ["0", "0"]
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);
    var isAdjacent = false;

    let otherTiles = [];

    otherTiles.push(document.getElementById((r-1) + "-" + c));
    otherTiles.push(document.getElementById((r+1) + "-" + c));
    otherTiles.push(document.getElementById(r + "-" + (c-1)));
    otherTiles.push(document.getElementById(r + "-" + (c+1)));

    otherTiles.forEach((tile) => {
        if (tile && tile.innerHTML.includes(" ")){ 
            isAdjacent = true;
            otherTile = tile;
        }
    });

    if (isAdjacent) {
        moveTiles();
    }

}

function dragEnd() {
    if (!otherTile.innerHTML.includes(" ")) {
        return;
    }

    let currCoords = currTile.id.split("-"); //ex) "0-0" -> ["0", "0"]
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    let moveLeft = r == r2 && c2 == c-1;
    let moveRight = r == r2 && c2 == c+1;

    let moveUp = c == c2 && r2 == r-1;
    let moveDown = c == c2 && r2 == r+1;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if (isAdjacent) {
        moveTiles();
    }

}

function moveTiles() {
    let currImg = currTile.innerHTML;
    let otherImg = otherTile.innerHTML;

    currTile.innerHTML = otherImg;
    otherTile.innerHTML = currImg;

    turns += 1;
    document.getElementById("turns").innerText = turns;
}
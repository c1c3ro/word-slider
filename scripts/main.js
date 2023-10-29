// --------- Funções utilitárias -------------

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

const shuffle = (array) => { 
    for (let i = array.length - 1; i > 0; i--) { 
      const j = Math.floor(Math.random() * (i + 1)); 
      [array[i], array[j]] = [array[j], array[i]]; 
    } 
    return array; 
}; 

// --------- Variáveis -------------

var rows = 4;
var columns = 4;

var wordsArray = [];
var words;
var template;
var currTile;
var otherTile; //blank tile
 
var turns = 0;

// --------- Função principal -------------

window.onload = function() {


    fetch('https://word-slider.vercel.app/database/fourLetterDelas.json')
    .then((response) => response.json())
    .then((json) => {

        for (i=0; i<3; i++) wordsArray.push(json[Math.floor(Math.random() * json.length)]);

        fetch('https://word-slider.vercel.app/database/threeLetterDelas.json')
        .then((response) => response.json())
        .then((json) => {

            wordsArray.push(json[Math.floor(Math.random() * json.length)]);

            words = wordsArray.flat(1);  // Array de palavras
            
            let splitted = words.map((word) => {  // Separando cada letra de cada palavra
                console.log(word);
                return word.split('');
            });

            splitted = splitted.flat(1);  // Convertendo os arrays de letras num único array
            template = splitted.flat(1);  // Variável para manter a ordem das letras para verificar se o usuário acertou
            template.push(" "); // Adicionando o espaço em branco 

            splitted = shuffle(splitted); // Embaralhando as letras
            splitted.push(" "); // Adicionando o espaço em branco 

            return splitted;

        }).then((shuffledWords) => {

            for (i=0; i<4; i++){
                let word = document.createElement("p");
                word.innerHTML = words[i];
                document.getElementById("words").append(word);
            }
            

            for (let r=0; r < rows; r++) {
                for (let c=0; c < columns; c++) {
        
                    //<img id="0-0" src="1.jpg">
                    let tile = document.createElement("div");
                    tile.id = r.toString() + "-" + c.toString();
                    tile.className = "tile";
                    tile.innerHTML = shuffledWords.shift();
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
        });

    });

    
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
    let currAux = currTile.innerHTML;
    let otherAux = otherTile.innerHTML;

    currTile.innerHTML = otherAux;
    otherTile.innerHTML = currAux;

    turns += 1;
    document.getElementById("turns").innerText = turns;


    var board = [...document.querySelectorAll(".tile")];
    var boardWords = [];

    board.forEach((letter) => {
        boardWords.push(letter.innerHTML);
    });

    setTimeout(() => {
        if (JSON.stringify(boardWords) === JSON.stringify(template)) {
            var successAlert = document.querySelector(".successalert");
            var reload = document.querySelector(".reload");
            var container = document.querySelector(".container");
            var recordText = document.querySelector(".record");
            var recordCookie = getCookie("record");

            document.querySelector(".turns-success").innerText = turns;

            if (!recordCookie) {
                setCookie("record", turns, 365);
                recordText.innerText = turns;
            } else if (parseInt(recordCookie) <= parseInt(turns)) {
                recordText.innerText = recordCookie;
            } else {
                recordText.innerText = turns;
                setCookie("record", turns, 365);
            }

            successAlert.classList.add("show");
            container.classList.add("blur");

            reload.addEventListener("click", function () {
                document.querySelector(".loading").style.display = "block";
                window.location.reload();
            });

        }
    }, 1000);
}
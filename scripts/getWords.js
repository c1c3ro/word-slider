var fourLetters = [];
var pontuacao = [".", ",", "!", "?", ":", ";", "(", ")", "/", "'", '"', "´", "’", "«", "-", "[", "]", "{", "}", '`', "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "y", "Y", "w", "W"];

fetch('http://127.0.0.1:5500/scripts/dicio-usp.json')
.then((response) => response.json())
.then((json) => {
    json.forEach(element => {
        var word;

        try {
            word = element["a"];
            if (word.length == 3) fourLetters.push(word);
        } catch(e){
            console.log(e);
        }

    });

    var fourLettersConcat = fourLetters.flat(1);
    var upperWrds = fourLettersConcat.map(element => {
        return element.toUpperCase();
    });
    fourLetters = [...new Set(upperWrds)];
    console.log(fourLetters);

    const fs = require('fs');
    const jsonContent = JSON.stringify(fourLetters);

    fs.writeFile("./threeWords.json", jsonContent, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });  

});

// fetch('http://127.0.0.1:5500/letras_mpb.json')
// .then((response) => response.json())
// .then((json) => {
//     json.forEach(element => {

//         let lyric = element["letras"].split(" ");

//         fourLetters.push(lyric.filter((word) => {

//             if (word.length !== 3) return false;

//             let check = true;

//             pontuacao.forEach(pont => {
//                 if (word.includes(pont)) {
//                     check = false
//                 }
//             });

//             return check;
//         }));

//     });

//     var fourLettersConcat = fourLetters.flat(1);
//     var upperWrds = fourLettersConcat.map(element => {
//         return element.toUpperCase();
//     });
//     fourLetters = [...new Set(upperWrds)];
//     console.log(fourLetters);

//     const fs = require('fs');
//     const jsonContent = JSON.stringify(fourLetters);

//     fs.writeFile("./threeLetters.json", jsonContent, 'utf8', function (err) {
//         if (err) {
//             return console.log(err);
//         }

//         console.log("The file was saved!");
//     });  

// });
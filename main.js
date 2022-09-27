let outName;
// start and named function
document.querySelector(".start-screen span").onclick = () => {
    let name = prompt("اكتب اسمك هنا");
    if (name === null || name === "") {
        name = "مجهول";
    }
    document.querySelector(".name span").innerHTML = name;
    //
    document.querySelector(".start-screen").remove();
    //
    timerCounDown();
    //
    outName = name;
}
//
let blocksCont = document.querySelector(".blocks");
let blocks = Array.from(blocksCont.children);
let duration = 1000;
// let orderRange = Array.from(Array(blocks.length).keys());
let orderRange = [...Array(blocks.length).keys()];
// let orderRange = Array.from(blocks.keys())
shuffle(orderRange);
//random order and flipp
blocks.forEach((block, index) => {
    block.style.order = orderRange[index];
    // block.addEventListener('click', () => flippeCard(block));
    block.onclick = () => flippeCard(block);
});
// flippe Card function
let allMatched = [];
function flippeCard(block) {
    // add flipped class
    block.classList.add("flipped");
    // check forcard has fleipped
    let allFlippedCards = blocks.filter(block => block.classList.contains("flipped"));
    // no more 2 cards must flliped
    if (allFlippedCards.length === 2) {
        // stop clicking 
        stopCliking();
        // check matched cards
        checkMatchedCard(allFlippedCards[0], allFlippedCards[1]);
    }
    //
    allMatched = blocks.filter(matchCard => matchCard.classList.contains("match"));
}
// stop clicking function
function stopCliking() {
    blocksCont.classList.add("no-clicking");
    setTimeout(() => {
        blocksCont.classList.remove("no-clicking");
    }, duration)
}
// matched card function
let wrongTries = document.querySelector(".tries span");
function checkMatchedCard(firstCard, secondCard) {
    // if(firstCard.dataset.animal === secondCard.dataset.animal)
    if (firstCard.getAttribute("data-animal") === secondCard.getAttribute("data-animal")) {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        //
        firstCard.classList.add("match");
        secondCard.classList.add("match");
        // success sound play
        document.getElementById("success").play();
    } else {
        wrongTries.innerHTML = parseFloat(wrongTries.innerHTML) + 1;
        //
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
        }, duration);
        // fail sound play
        document.getElementById("fail").play();
    }
}
// shuffle funcction
function shuffle(array) {
    let current = array.length,
        temp,
        random;
    //loop
    while (current > 0) {
        random = Math.floor(Math.random() * current);
        current--;
        //
        temp = array[current];
        //
        array[current] = array[random];
        //
        array[random] = temp;
    }
    // return array;
}
//
let resultBoard;
if (localStorage.getItem("board")) {
    resultBoard = JSON.parse(localStorage.getItem("board"));
} else {
    resultBoard = []
}
// timer function
let minutes = document.getElementById("minutes");
let seconds = document.getElementById("seconds");
let loseScreen = document.querySelector(".lose-screen");
let result = document.querySelector(".lose-screen p");
let fin;
//
function timerCounDown() {
    let timer = setInterval(() => {
        if (seconds.innerHTML == 0) {
            minutes.innerHTML < 10
                ? minutes.innerHTML = `0${minutes.innerHTML - 1}`
                : minutes.innerHTML -= 1;
            //
            seconds.innerHTML = 60;
        }
        //
        seconds.innerHTML < 10
            ? seconds.innerHTML = `0${seconds.innerHTML - 1}`
            : seconds.innerHTML -= 1;
        //
        if (minutes.innerHTML == 0 && seconds.innerHTML == 0 || allMatched.length === blocks.length) {
            clearInterval(timer);
            //
            loseScreen.style.display = "block";
            //
            window.onclick = () => window.location.reload();
            //
            if (minutes.innerHTML == 0 && seconds.innerHTML == 0) {
                result.innerHTML = "لقد خسرت";
                fin = "خاسر";
            } else {
                result.innerHTML = "لقد فزت";
                fin = "فائز";
            }
            //
            let player = {
                name: outName,
                tries: wrongTries.innerHTML,
                result: fin,
            }
            resultBoard.push(player);
            localStorage.setItem("board", JSON.stringify(resultBoard));
            showData();
        }
    }, duration);
}
//
// 
function showData() {
    let table = ``;
    for (let i = 0; i < resultBoard.length; i++) {
        table += `
            <tr>
            <td>${i + 1}</td>
            <td>${resultBoard[i].name}</td>
            <td>${resultBoard[i].tries}</td>
            <td>${resultBoard[i].result}</td>
            </tr>
            `;
    }
    document.querySelector("table tbody").innerHTML = table;
}
showData();
// clear data feom local storage
document.querySelector(".head span").onclick = () => {
    localStorage.clear();
    resultBoard.splice(0);
    showData();
}
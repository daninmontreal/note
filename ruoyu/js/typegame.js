
// Globals
let time = 7,
    finalScore = 0,
    interval,
    isPlaying = false;

let words = [
    "Nigeria",
    "Grovel",
	"Prestidigitation",
	"Generator",
	"Eminent",
	"Typescript",
	"Rhesus",
	"Staphylococcus", 
	"Developer",
	"Establishment",
	"Placid",
	"Javascript",
	"Encapsulate",
	"Pulchritude",
	"Function",
	"Antiquewhite",]

function withTypeContext(fn) {
    const currentWord = document.querySelector("#current-word"),
        input = document.querySelector("#input"),
        timer = document.querySelector("#timer"),
        displayScore = document.querySelector("#score"),
        reset = document.querySelector("#reset");
    fn(currentWord, input, timer, displayScore, reset);
}

function countdown() {
    withTypeContext((currentWord, input, timer, displayScore, reset) => {
        if (time > 1) {
            time--;
        } else if (time == 1) {
            time--;
            clearInterval(interval);
            alert("Game Over");
        }
        timer.textContent = time;
    });
}

function displayWords() {
    withTypeContext((currentWord, input, timer, displayScore, reset) => {
        let randIndex = Math.floor(Math.random() * words.length);
        let randWord = words[randIndex];
        currentWord.textContent = randWord;
    });
}

function startGame() {
    withTypeContext((currentWord, input, timer, displayScore, reset) => {
        let textEnteredLength = input.value.length;

        if (textEnteredLength == 1 && !isPlaying) {
            isPlaying = true;
            interval = setInterval(countdown, 1000);
        }
    });
}

function matchWord() {
    withTypeContext((currentWord, input, timer, displayScore, reset) => {
        let textEntered = input.value;
        let wordMatch = currentWord.textContent;

        if (textEntered == wordMatch && time != 0) {
            displayWords();
            input.value = "";
            score++;
            time = 8;
        } else {
        }
        displayScore.textContent = score;
    });
}

function startOver() {
    withTypeContext((currentWord, input, timer, displayScore, reset) => {
        clearInterval(interval);
        isPlaying = false;
        finalScore = 0;
        time = 7;
        input.value = "";
        displayScore.textContent = finalScore;
        timer.textContent = time;
    });
}

function startTypeGame() {
    withTypeContext((currentWord, input, timer, displayScore, reset) => {
        window.addEventListener("load", displayWords);
        input.addEventListener("input", startGame);
        input.addEventListener("input", matchWord);
        reset.addEventListener("click", startOver);
    });
}

if (document.readyState != 'loading') {
    startTypeGame();
} else {
    window.addEventListener('DOMContentLoaded', () => {
        startTypeGame();
    });
}
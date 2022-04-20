const gameBoard = document.querySelector(".container");
const resetButton = document.querySelector("#reset");
const messageElement = document.querySelector("#message");
const singlePlayButton = document.querySelector("#singlePlay");
const winPossibilities = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];
let singlePlay = false;
let playerATurn = false;
let choicesPlayerA = [];
let choicesPlayerB = [];

gameBoard.addEventListener("click", (e) => {
    resetButton.style.visibility = "visible";
    
    if (!e.target.textContent) {
        playerATurn = !playerATurn;
        !singlePlay && styleSinglePlayButton("#0a5381", true);
        messageElement.textContent = "";
        if (!singlePlay) {
            e.target.textContent = playerATurn ? "X" : "O";
            playerATurn ? choicesPlayerA.push(Number(e.target.id)) : choicesPlayerB.push(Number(e.target.id));
            if (choicesPlayerA.length >= 3 || choicesPlayerB.length >= 3) playerATurn ? checkWinner("X") : checkWinner("O");
        }
        if (singlePlay && playerATurn) {
            e.target.textContent = "X";
            choicesPlayerA.push(Number(e.target.id));
            choicesPlayerA.length >= 3 && playerATurn && checkWinner("X");
            playerATurn = !playerATurn;
            setTimeout(selfPlay, 700)
        }
    } else {
        if(e.target.className === "cell") messageElement.textContent = "Este casillero ya fue clickeado. Selecciona otro.";
    }
});

resetButton.addEventListener("click", (e) => {
    e.preventDefault();
    playerATurn = false;
    singlePlay = false;
    choicesPlayerA = [];
    choicesPlayerB = [];
    styleSinglePlayButton("#0a5381", false);
    resetButton.style.background = "#053756f5"
    resetButton.style.boxShadow = "none";
    singlePlayButton.style.boxShadow = "1px 2px 7px black";
    setTimeout(function(){
        resetButton.style.background = "#0a5381", resetButton.style.boxShadow = "1px 2px 7px black"}, 300);
    messageElement.textContent = "";
    document.querySelectorAll(".cell").forEach(cell => cell.textContent = "");
});

singlePlayButton.addEventListener("click", function (e) {
    e.preventDefault();
    singlePlay = true;
    styleSinglePlayButton("#053756f5", true);
    singlePlayButton.style.boxShadow = "none";
})

const checkWinner = (char) => {
    let choices = char === "X" ? choicesPlayerA : choicesPlayerB;
    let playerName = char === "X" ? "jugador A" : "Jugador B";

    for (let winPossibility of winPossibilities) {
        let hits = [];
        for (let choice of choices) winPossibility.includes(choice) && hits.push(choice);
        if (hits.length === 3) {
            messageElement.textContent = `Ganó el ${playerName}!`;
            break;
        }
        if (choices.length === 5 && hits.lenght !== 3) {
            messageElement.textContent = `Empate!`;
        }
    }
};

const selfPlay = () => {
    let cellPosition;
    while (!choicesPlayerA.includes(cellPosition) && choicesPlayerB.length !== 4) {
        if (choicesPlayerB.includes(cellPosition)) {
            cellPosition = 0;
            break;
        }
        cellPosition = Math.ceil(Math.random() * 9);
        if (choicesPlayerA.includes(cellPosition) || choicesPlayerB.includes(cellPosition)) {
            cellPosition = 0;
            continue;
        }
        choicesPlayerB.push(cellPosition);
        document.getElementById(cellPosition).textContent = "O";
        choicesPlayerB.length >= 3 && !playerATurn && checkWinner("O");
    }
};

const styleSinglePlayButton = (background, isDisabled = false) => {
    singlePlayButton.style.background = background;
    singlePlayButton.disabled = isDisabled;
};

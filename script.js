const winPossibilities = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];
let cellsHits = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];
const gameBoard = document.querySelector(".container");
const resetButton = document.querySelector("#reset");
const messageElement = document.querySelector("#message");
const singlePlayButton = document.querySelector("#singlePlay");
let singlePlay = playerATurn = gameFinished = false;
let choicesPlayerA = [];
let choicesPlayerB = [];

gameBoard.addEventListener("click", e => {
    resetButton.style.display = "inline";

    if (!e.target.textContent) {
        playerATurn = !playerATurn;
        !singlePlay && styleSinglePlayButton("#0a5381", true);
        if (!gameFinished) messageElement.textContent = "";

        if (singlePlay) {
            !gameFinished && play("X", choicesPlayerA, e);
            (choicesPlayerA.length >= 3 && playerATurn && !gameFinished) && checkWinner("X");
            !gameFinished && setTimeout(autoPlay, 500);
        } else {
            if (!gameFinished) playerATurn ? play("X", choicesPlayerA, e) : play("O", choicesPlayerB, e);
            if ((choicesPlayerA.length >= 3 || choicesPlayerB.length >= 3) && !gameFinished) playerATurn ? checkWinner("X") : checkWinner("O");
        }
    }
    else if (e.target.className === "cell" && !gameFinished) messageElement.textContent = "Este casillero ya fue clickeado. Selecciona otro.";
});

resetButton.addEventListener("click", e => {
    e.preventDefault();
    singlePlay = playerATurn = gameFinished = false;
    choicesPlayerA = [];
    choicesPlayerB = [];
    cellsHits = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];
    styleSinglePlayButton("#0a5381", false);
    resetButton.style.background = "#053756f5"
    resetButton.style.boxShadow = "none";
    singlePlayButton.style.boxShadow = "1px 2px 7px black";
    setTimeout(() => {
        resetButton.style.background = "#0a5381"; 
        resetButton.style.boxShadow = "1px 2px 7px black";
    }, 300);
    messageElement.textContent = "";
    document.querySelectorAll(".cell").forEach(cell => cell.textContent = "");
});

singlePlayButton.addEventListener("click", e => {
    e.preventDefault();
    singlePlay = true;
    styleSinglePlayButton("#053756f5", true);
    singlePlayButton.style.boxShadow = "none";
})

const checkWinner = char => {
    let choices = char === "X" ? choicesPlayerA : choicesPlayerB;
    let playerName = char === "X" ? "jugador A" : "Jugador B";

    for (let winPossibility of winPossibilities) {
        let hits = 0;
        for (let choice of choices) winPossibility.includes(choice) && hits++;
        if (hits === 3) {
            messageElement.textContent = `Ganó el ${playerName}!`;
            gameFinished = true;
            break;
        }
        if (choices.length === 5 && hits !== 3) messageElement.textContent = `Empate!`;
        hits = 0;
    }
};

const play = (char, choices, e) => {
    e.target.textContent = char;
    choices.push(Number(e.target.id));
    cellsHits.forEach(arr => arr.forEach(cell => {
        if (e.target.id == cell) arr[arr.indexOf(cell)] = char;
    }));
};

const autoPlay = () => {
    let cellPosition, xHas2Hits, oHas2Hits, only1hit;
    playerATurn = !playerATurn;
    while (!choicesPlayerA.includes(cellPosition) && choicesPlayerB.length !== 4) {
        if (choicesPlayerB.includes(cellPosition)) {
            cellPosition = 0;
            break;
        }
        if (choicesPlayerA.length === 1) cellPosition = Math.ceil(Math.random() * 9); //first time cell position is random
        if (choicesPlayerA.includes(cellPosition) || choicesPlayerB.includes(cellPosition)) {
            cellPosition = 0;
            continue;
        }
        if (choicesPlayerA.length !== 1) cellsHits.forEach(arr => {
            let xCounter = 0;
            let oCounter = 0;
            arr.forEach(cell => {
                cell === "X" && xCounter++;
                cell === "O" && oCounter++;
            })
            if (xCounter === 2 && oCounter === 0) xHas2Hits = cellsHits.indexOf(arr)
            if (oCounter === 2 && xCounter === 0) oHas2Hits = cellsHits.indexOf(arr);
            if (!(xCounter === 2 && oCounter === 1) && !(oCounter === 2 && xCounter === 1)) only1hit = cellsHits.indexOf(arr);
            xCounter = oCounter = 0;
        });
        if (oHas2Hits !== undefined) cellsHits[oHas2Hits].forEach(cell => { if (typeof cell === "number") cellPosition = cell })
        else if (xHas2Hits !== undefined) cellsHits[xHas2Hits].forEach(cell => { if (typeof cell === "number") cellPosition = cell })
        else if (only1hit !== undefined) cellsHits[only1hit].forEach(cell => { if (typeof cell === "number") cellPosition = cell });

        document.getElementById(cellPosition).textContent = "O";
        cellsHits.forEach(arr => arr.forEach(cell => {if (cellPosition == cell) arr[arr.indexOf(cell)] = "O"}));
        choicesPlayerB.push(cellPosition);
        choicesPlayerB.length >= 3 && !playerATurn && checkWinner("O");
    }
};

const styleSinglePlayButton = (background, isDisabled = false) => {
    singlePlayButton.style.background = background;
    singlePlayButton.disabled = isDisabled;
};

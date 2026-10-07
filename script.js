/* =========================================
   AI TIC-TAC-TOE
   MINIMAX ALGORITHM
   ========================================= */


/* ---------- GAME VARIABLES ---------- */

// Empty game board
let board = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
];


// Game status
let gameOver = false;


// Prevent user from clicking
// while AI is thinking
let aiThinking = false;


// Score
let playerScore = 0;
let aiScore = 0;
let drawScore = 0;


/* ---------- DOM ELEMENTS ---------- */

const cells =
    document.querySelectorAll(".cell");

const statusText =
    document.getElementById("status");

const playerScoreText =
    document.getElementById("playerScore");

const aiScoreText =
    document.getElementById("aiScore");

const drawScoreText =
    document.getElementById("drawScore");

const newGameButton =
    document.getElementById("newGame");


/* ---------- WINNING PATTERNS ---------- */

const winningCombinations = [

    [0, 1, 2],

    [3, 4, 5],

    [6, 7, 8],

    [0, 3, 6],

    [1, 4, 7],

    [2, 5, 8],

    [0, 4, 8],

    [2, 4, 6]

];


/* =========================================
   PLAYER MOVE
   ========================================= */

cells.forEach(cell => {

    cell.addEventListener("click", () => {

        // Don't allow move during AI turn
        if (aiThinking) {
            return;
        }


        // Don't allow move after game ends
        if (gameOver) {
            return;
        }


        // Get clicked cell
        const index =
            Number(
                cell.getAttribute("data-index")
            );


        // Don't allow occupied cell
        if (board[index] !== "") {
            return;
        }


        // Player places X
        board[index] = "X";

        cell.textContent = "❌";

        cell.disabled = true;


        // Check game result
        const result =
            checkGameResult();


        if (result) {
            return;
        }


        // AI turn
        aiThinking = true;

        statusText.textContent =
            "🤖 AI is thinking...";


        // Small delay so user can
        // see AI thinking
        setTimeout(() => {

            computerMove();

        }, 400);

    });

});


/* =========================================
   COMPUTER MOVE
   ========================================= */

function computerMove() {

    // Stop if game ended
    if (gameOver) {

        aiThinking = false;

        return;
    }


    let bestScore = -Infinity;

    let bestMove = -1;


    /*
       Try every empty position.
       The Minimax algorithm calculates
       the score of each possible move.
    */

    for (let i = 0; i < 9; i++) {

        if (board[i] === "") {

            // Try O
            board[i] = "O";


            // Calculate future result
            const score =
                minimax(
                    board,
                    false
                );


            // Undo move
            board[i] = "";


            // Select best score
            if (score > bestScore) {

                bestScore = score;

                bestMove = i;

            }

        }

    }


    // Make the best move
    if (bestMove !== -1) {

        board[bestMove] = "O";

        cells[bestMove].textContent =
            "⭕";

        cells[bestMove].disabled =
            true;

    }


    aiThinking = false;


    // Check game result
    const result =
        checkGameResult();


    if (!result) {

        statusText.textContent =
            "Your Turn ❌";

    }

}


/* =========================================
   MINIMAX ALGORITHM
   ========================================= */

function minimax(
    boardState,
    isMaximizing
) {


    /* ---------- AI WIN ---------- */

    if (
        checkWinner(
            boardState,
            "O"
        )
    ) {

        return 10;

    }


    /* ---------- HUMAN WIN ---------- */

    if (
        checkWinner(
            boardState,
            "X"
        )
    ) {

        return -10;

    }


    /* ---------- DRAW ---------- */

    if (
        isBoardFull(
            boardState
        )
    ) {

        return 0;

    }


    /* =====================================
       MAXIMIZING PLAYER
       COMPUTER = O
       ===================================== */

    if (isMaximizing) {

        let bestScore =
            -Infinity;


        for (let i = 0; i < 9; i++) {

            if (boardState[i] === "") {

                // Try AI move
                boardState[i] = "O";


                // Evaluate
                const score =
                    minimax(
                        boardState,
                        false
                    );


                // Undo
                boardState[i] = "";


                // Maximize score
                bestScore =
                    Math.max(
                        bestScore,
                        score
                    );

            }

        }


        return bestScore;

    }


    /* =====================================
       MINIMIZING PLAYER
       HUMAN = X
       ===================================== */

    else {

        let bestScore =
            Infinity;


        for (let i = 0; i < 9; i++) {

            if (boardState[i] === "") {

                // Try human move
                boardState[i] = "X";


                // Evaluate
                const score =
                    minimax(
                        boardState,
                        true
                    );


                // Undo
                boardState[i] = "";


                // Minimize score
                bestScore =
                    Math.min(
                        bestScore,
                        score
                    );

            }

        }


        return bestScore;

    }

}


/* =========================================
   CHECK WINNER
   ========================================= */

function checkWinner(
    boardState,
    player
) {

    for (
        const combination
        of winningCombinations
    ) {

        const a =
            combination[0];

        const b =
            combination[1];

        const c =
            combination[2];


        if (
            boardState[a] === player &&
            boardState[b] === player &&
            boardState[c] === player
        ) {

            return true;

        }

    }


    return false;

}


/* =========================================
   CHECK BOARD FULL
   ========================================= */

function isBoardFull(
    boardState
) {

    return boardState.every(
        cell => cell !== ""
    );

}


/* =========================================
   CHECK GAME RESULT
   ========================================= */

function checkGameResult() {


    /* ---------- PLAYER WIN ---------- */

    if (
        checkWinner(
            board,
            "X"
        )
    ) {

        statusText.textContent =
            "🎉 You Win!";

        playerScore++;

        playerScoreText.textContent =
            playerScore;

        gameOver = true;

        disableBoard();

        return true;

    }


    /* ---------- AI WIN ---------- */

    if (
        checkWinner(
            board,
            "O"
        )
    ) {

        statusText.textContent =
            "🤖 AI Wins!";

        aiScore++;

        aiScoreText.textContent =
            aiScore;

        gameOver = true;

        disableBoard();

        return true;

    }


    /* ---------- DRAW ---------- */

    if (
        isBoardFull(
            board
        )
    ) {

        statusText.textContent =
            "🤝 It's a Draw!";

        drawScore++;

        drawScoreText.textContent =
            drawScore;

        gameOver = true;

        disableBoard();

        return true;

    }


    return false;

}


/* =========================================
   DISABLE BOARD
   ========================================= */

function disableBoard() {

    cells.forEach(
        cell => {

            cell.disabled = true;

        }
    );

}


/* =========================================
   NEW GAME
   ========================================= */

newGameButton.addEventListener(
    "click",
    startNewGame
);


function startNewGame() {

    // Reset board
    board = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    ];


    // Reset status
    gameOver = false;

    aiThinking = false;


    // Clear cells
    cells.forEach(
        cell => {

            cell.textContent = "";

            cell.disabled = false;

        }
    );


    // Reset status
    statusText.textContent =
        "Your Turn ❌";

}


/* =========================================
   REGISTER SERVICE WORKER
   ========================================= */

if (
    "serviceWorker"
    in navigator
) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register(
                    "./service-worker.js"
                )
                .then(
                    registration => {

                        console.log(
                            "Service Worker registered:",
                            registration.scope
                        );

                    }
                )
                .catch(
                    error => {

                        console.error(
                            "Service Worker registration failed:",
                            error
                        );

                    }
                );

        }
    );

}
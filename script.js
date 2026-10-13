function GameBoard() {

    const board = Array(9);

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            board[i * 3 + j] = new Cell();
        }
    }

    const convert = (i, j) => {
        return i * 3 + j;
    }

    const setCell = (i, j, val) => {
        if (board[convert(i,j)].getValue() === "_") {
            board[convert(i,j)].setValue(val);
        }
    }

    const getCell = (i, j) => {
        return board[convert(i, j)];
    }

    const getBoard = () => {
        return board;
    }

    const resetBoard = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[convert(i,j)].setValue("_");
            }
        }
    }

    return {convert, setCell, getCell, getBoard, resetBoard};
}

function Cell() {

    if (!new.target) {
        throw Error("use new keyword for Cell Object creation");
    }

    let value = "_";

    const setValue = (val) => {
        if (val === "_" || val === "X" || val === "O") {
            value = val;
        }
        return
    }


    const getValue = () => {
        return value;
    }

    return {setValue, getValue};
}

function GameController(playerOne, playerTwo) {

    const gb = GameBoard();
    let winner = null;

    const players = [
        {
            name: playerOne,
            token: "X",
        },
        {
            name: playerTwo,
            token: "O",
        },
    ];

    const winningLines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    let activePlayer = players[0];

    const getActivePlayer = () => {
        return activePlayer;
    }

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const playRound = (row, col) => {
        gb.setCell(row, col, activePlayer.token);

        const board = gb.getBoard();

        const win = winningLines.some(line => 
            line.every(index => 
                board[index].getValue() === activePlayer.token
            )
        );
        
        if (win) {
            winner = activePlayer;
            return
        }

        switchActivePlayer();
    }

    const getWinner = () => {
        return winner;
    }

    const reset = () => {
        gb.resetBoard();
        winner = null;
        activePlayer = players[0];
    }

    return {getActivePlayer, playRound, getBoard: gb.getBoard, convert: gb.convert, getWinner, reset}    
}


function ScreenController(playerOne, playerTwo) {
    const gc = GameController(playerOne, playerTwo);
    const grid = document.querySelector("#grid");
    const activePlayer = document.querySelector("h1");
    const resetButton = document.querySelector("#reset");

    resetButton.addEventListener("click", () => {
        gc.reset();
        lock = false;
        update();
    });

    let lock = false;

    const update = () => {
        if (lock) return;

        let board = gc.getBoard();

        if (gc.getWinner() !== null) {
            activePlayer.textContent = `${gc.getWinner().name} won!`;
            resetButton.style['display'] = 'block';
            lock = true;
        } else {
            activePlayer.textContent = `${gc.getActivePlayer().name}'s turn`; 
        }

        grid.textContent = "";

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const button = document.createElement("button");
                button.classList.add("cell");
                
                button.textContent = board[i * 3 + j].getValue();
                button.dataset.row = i;
                button.dataset.col = j;
                grid.appendChild(button);
            }
        }
        
    };

    grid.addEventListener("click", e => {
        const {row, col} = e.target.dataset;
        const board = gc.getBoard()
        if (row === undefined || 
            col === undefined || 
            board[gc.convert(Number(row), Number(col))].getValue() !== "_") {
            return;
        }

        gc.playRound(Number(row), Number(col));

        update();
    })

    update();

}



ScreenController("brian", "thomas");
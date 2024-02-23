const gameboard = (function() {
    let rows = 3;
    let columns = 3;
    let board = [];

    let printBoard = () => {
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i][j] = '/';
            }
        }}

    let boardMap = [
        [0,0], [0,1],[0,2],
        [1,0], [1,1],[1,2],
        [2,0], [2,1],[2,2]
    ]

    const getRow = (rowNumber) => [board[rowNumber][0], board[rowNumber][1], board[rowNumber][2]];
    const getColumn = (columnNumber) => [board[0][columnNumber], board[1][columnNumber], board[2][columnNumber]];

    const getValue = (rowNumber, columnNumber) => board[rowNumber][columnNumber];

    const setPlayerBoardValue = (rowNumber, columnNumber) => board[rowNumber][columnNumber] = displayController.playerValue;
    const setComputerBoardValue = (rowNumber, columnNumber) => board[rowNumber][columnNumber] = displayController.computerValue;

    return { rows, columns, board, printBoard, boardMap, getRow, getColumn, getValue, setPlayerBoardValue, setComputerBoardValue }

})();

gameboard.printBoard();

const displayController = (function() {

    const x = document.getElementById('X');
    const o = document.getElementById('O');
    const boardBtn = document.querySelectorAll('.board-btn ');
    const restartBtn = document.getElementById('restart-btn');
    const winnerDiv = document.getElementById('winner-div');
    const winnerDeclaration = document.getElementById('winner-declaration');
    const playNewGameBtn = document.getElementById('play-new-game-btn');

    let playerValue = 'X';
    let computerValue = 'O';   

    const restartGame = () => {
        // location.reload();
        gameboard.printBoard();
        gameboard.boardMap = [
            [0,0], [0,1],[0,2],
            [1,0], [1,1],[1,2],
            [2,0], [2,1],[2,2]
        ]
        displayController.boardBtn.forEach((el) => {
            el.textContent = '';
            el.disabled = false;
            el.classList.remove('disabled-btn');
        })

        if (displayController.playerValue == 'O') {
            setTimeout(() => {
                setComputerValue();
            }, 900);
        }

    }

    return { x, o, playerValue, computerValue, boardBtn, restartBtn, winnerDiv, winnerDeclaration, playNewGameBtn, restartGame }
})()


displayController.x.addEventListener('click', () => {
    displayController.playerValue = 'X';
    displayController.computerValue = 'O';
    displayController.restartGame();
    displayController.x.classList.add('selected-champion');
    displayController.o.classList.remove('selected-champion');
})

displayController.o.addEventListener('click', () => {
    displayController.playerValue = 'O';
    displayController.computerValue = 'X'
    displayController.restartGame();
    displayController.o.classList.add('selected-champion');
    displayController.x.classList.remove('selected-champion');
    
})

displayController.boardBtn.forEach((el) => {
    el.addEventListener('click', () => {
        setPlayerValue(el.value);
    })
})


displayController.restartBtn.addEventListener('click', () => {
    displayController.restartGame();
    displayController.winnerDiv.style.display = 'none';
    
})

displayController.playNewGameBtn.addEventListener('click', () => {
    displayController.restartGame();
    displayController.winnerDiv.style.display = 'none';
})

const setPlayerValue = (val) => {


    if (gameboard.getValue(val[0], val[1]) === '/') {
        
        displayController.boardBtn.forEach((el) => {
            if (el.value === val) {
                    el.textContent = displayController.playerValue;
                    gameboard.setPlayerBoardValue(val[0], val[1]);
            }
        })
        
    } else {
        alert('please choose a valid space');
        return;
    }

    for (let i = 0; i < gameboard.boardMap.length; i++) {
        if (gameboard.boardMap[i][0] == val[0] && gameboard.boardMap[i][1] == val[1]){

            gameboard.boardMap.splice(i, 1, );

        }
    }

    if (displayController.playerValue == 'X') {
        winningSequence.checkSequencesX();
    } else {
        winningSequence.checkSequencesO();
    }
    
}

const setComputerValue = () => {

    let positionSelection = gameboard.boardMap[Math.floor(Math.random() * gameboard.boardMap.length)];

    for (let i = 0; i < gameboard.boardMap.length; i++) {

        if (positionSelection == gameboard.boardMap[i] 
                && gameboard.getValue(positionSelection[0], positionSelection[1]) == '/') {

            gameboard.setComputerBoardValue(positionSelection[0], positionSelection[1]);
            gameboard.boardMap.splice(i, 1, );

            displayController.boardBtn.forEach((el) => {
                if (el.value == `${positionSelection[0]}${positionSelection[1]}`) {
                     el.textContent = displayController.computerValue;
                }
            })

        } 
    }

    if (displayController.playerValue == 'X') {
        winningSequence.checkSequencesO();
    } else {
        winningSequence.checkSequencesX();
    }

}

const winningSequence = (function() {

    const sequenceXHorVert = /XXX/;
    const sequenceXDiag = /[XO/][XO/][X][XO/][X][XO/][X][XO/][XO/]|[X][XO/][XO/][XO/][X][XO/][XO/][XO/][X]/;

    const sequenceOHorVert = /OOO/;
    const sequenceODiag = /[XO/][XO/][O][XO/][O][XO/][O][XO/][XO/]|[O][XO/][XO/][XO/][O][XO/][XO/][XO/][O]/;


    const winnerPlayer = () => {
        displayController.boardBtn.forEach((el) => {
            el.disabled = true;
            el.classList.add('disabled-btn');
        });
            displayController.winnerDiv.style.display = 'block';
            displayController.winnerDeclaration.textContent = 'Congrats! You beat a pseudorandom number generator!';
    };

    const winnerComputer = () => {
        displayController.boardBtn.forEach((el) => {
            el.disabled = true;
            el.classList.add('disabled-btn');
        })
        displayController.winnerDiv.style.display = 'block';
        displayController.winnerDeclaration.textContent = 'Congrats! A pseudorandom number generator beat you!'
        
    }

    const checkSequencesX = () => {
        
        if (gameboard.getRow(0).join("").match(winningSequence.sequenceXHorVert)
            || gameboard.getRow(1).join("").match(winningSequence.sequenceXHorVert)
            || gameboard.getRow(2).join("").match(winningSequence.sequenceXHorVert)) {
            
            if (displayController.playerValue == 'X') {
                return winningSequence.winnerPlayer();
            } else {
                return winningSequence.winnerComputer();
            }
            

        } else if (gameboard.getColumn(0).join("").match(winningSequence.sequenceXHorVert)
            || gameboard.getColumn(1).join("").match(winningSequence.sequenceXHorVert)
            || gameboard.getColumn(2).join("").match(winningSequence.sequenceXHorVert) ) {

            if (displayController.playerValue == 'X') {
                return winningSequence.winnerPlayer();
            } else {
                return winningSequence.winnerComputer();
            }

        } else if ((gameboard.getRow(0).join("")
                    .concat(gameboard.getRow(1).join(""))
                    .concat(gameboard.getRow(2).join("")))
                    .match(winningSequence.sequenceXDiag)) {

            if (displayController.playerValue == 'X') {
                return winningSequence.winnerPlayer();
            } else {
                return winningSequence.winnerComputer();
            }

        } else if (gameboard.boardMap.length == 0) {

            displayController.boardBtn.forEach((el) => {
                el.disabled = true;
                el.classList.add('disabled-btn');
            })
            displayController.winnerDiv.style.display = 'block';
            displayController.winnerDeclaration.textContent = 'Drew';            

        } else {

            if (displayController.playerValue == 'X') {
                return setTimeout(() => {
                    setComputerValue();
                }, 900);
            } else {
                return;
            }

        }
    }

    const checkSequencesO = () => {
        if (gameboard.getRow(0).join("").match(winningSequence.sequenceOHorVert)
        || gameboard.getRow(1).join("").match(winningSequence.sequenceOHorVert)
        || gameboard.getRow(2).join("").match(winningSequence.sequenceOHorVert)) {
                    
            if (displayController.playerValue == 'X') {
                return winningSequence.winnerComputer();
            } else {
                return winningSequence.winnerPlayer();
            }
        
    } else if (gameboard.getColumn(0).join("").match(winningSequence.sequenceOHorVert)
        || gameboard.getColumn(1).join("").match(winningSequence.sequenceOHorVert)
        || gameboard.getColumn(2).join("").match(winningSequence.sequenceOHorVert)) {
            
            if (displayController.playerValue == 'X') {
                return winningSequence.winnerComputer();
            } else {
                return winningSequence.winnerPlayer();
            }

    } else if ((gameboard.getRow(0).join("")
                .concat(gameboard.getRow(1).join(""))
                .concat(gameboard.getRow(2).join("")))
                .match(winningSequence.sequenceODiag)) {

            if (displayController.playerValue == 'X') {
                return winningSequence.winnerComputer();
            } else {
                return winningSequence.winnerPlayer();
            }

    } else if (gameboard.boardMap.length == 0) {

        displayController.boardBtn.forEach((el) => {
            el.disabled = true;
            el.classList.add('disabled-btn');
        })
        displayController.winnerDiv.style.display = 'block';
        displayController.winnerDeclaration.textContent = 'Drew';  

    } else {

        if (displayController.playerValue == 'O') {
                return setTimeout(() => {
                    setComputerValue();
                }, 700);
            } else {
                return;
            }
                    
    }
    }

    return { sequenceXHorVert, sequenceXDiag, sequenceOHorVert, sequenceODiag, checkSequencesX, checkSequencesO, winnerPlayer, winnerComputer };

})()
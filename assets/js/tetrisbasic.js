let canvas;
let ctx;
let gBArrayHeight = 20; // Number of cells in height
let gBArrayWidth = 12; // Number of cells in width
let startX = 4; // Initial x position 
let startY = 0; // Initial y position 
let score = 0; // Track score

let winOrLose = "Playing";
let tetrislogo;
let coordinateArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));
let curTetromino = [[1, 0], [0, 1], [1, 1], [2, 1]];
let nextTetromino;
let nextTetrominoColor;

let tetrominos = [];
let tetrominoColors = ['purple', 'cyan', 'blue', 'yellow', 'orange', 'green', 'red'];
let curTetrominoColor;

let gBArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));
let stopShapeArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));

let DIRECTION = {
    IDLE: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
};
let direction;

class Coordinates {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}


document.addEventListener('DOMContentLoaded', SetupCanvas);


function CreateCoordArray() {
    let i = 0, j = 0;
    for (let y = 9; y <= 446; y += 23) {
        for (let x = 11; x <= 264; x += 23) {
            coordinateArray[i][j] = new Coordinates(x, y);
            i++;
        }
        j++;
        i = 0;
    }
}

function SetupCanvas() {
    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 936;
    canvas.height = 956;

    ctx.scale(2, 2);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'black';
    ctx.strokeRect(8, 8, 280, 462);

    tetrislogo = new Image(161, 54);
    tetrislogo.onload = DrawTetrislogo;
    tetrislogo.src = "tetrislogo.png";

    ctx.fillStyle = 'black';
    ctx.font = '21px Arial';

    ctx.fillText("SCORE", 300, 98);
    ctx.strokeRect(300, 107, 161, 24);
    ctx.fillText(score.toString(), 310, 127);


    ctx.fillText(winOrLose, 310, 261);
    ctx.strokeRect(300, 232, 161, 95);
    ctx.fillText("CONTROLS", 300, 354);
    ctx.strokeRect(300, 366, 161, 104);

    ctx.font = '19px Arial';
    ctx.fillText("A : Move Left", 310, 388);
    ctx.fillText("D : Move Right", 310, 413);
    ctx.fillText("S : Move Down", 310, 438);
    ctx.fillText("E : Rotate", 310, 463);

    document.addEventListener('keydown', HandleKeyPress);
    CreateTetrominos();
    CreateTetromino();

    CreateCoordArray();
    DrawTetromino();
}

function DrawTetrislogo() {
    ctx.drawImage(tetrislogo, 300, 8, 161, 54);
}

function DrawTetromino() {
    for (let i = 0; i < curTetromino.length; i++) {
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;

        gBArray[x][y] = 1; // Fix indexing: gBArray[y][x] instead of gBArray[x][y]
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;

        ctx.fillStyle = curTetrominoColor;
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}

function HandleKeyPress(key) {
    if (winOrLose != "Game Over") {
        if (key.keyCode === 65) { // A
            direction = DIRECTION.LEFT;
            if (!HitWall() && !CheckForHorizontalCollision()) {
                DeleteTetromino();
                startX--;
                DrawTetromino();
            }
        } else if (key.keyCode === 68) { // D
            direction = DIRECTION.RIGHT;
            if (!HitWall() && !CheckForHorizontalCollision()) {
                DeleteTetromino();
                startX++;
                DrawTetromino();
            }
        } else if (key.keyCode === 83) { // S
            MoveTetrominoDown();
        } else if (key.keyCode === 69) { // E
            RotateTetromino();
        }
    }
}

function saveHighScore(playerName, score) {
    let form = document.createElement('form');
    form.method = 'POST';
    form.action = 'save_score';

    let playerNameField = document.createElement('input');
    playerNameField.type = 'hidden';
    playerNameField.name = 'player_name';
    playerNameField.value = playerName;
    form.appendChild(playerNameField);

    let scoreField = document.createElement('input');
    scoreField.type = 'hidden';
    scoreField.name = 'score';
    scoreField.value = score;
    form.appendChild(scoreField);

    document.body.appendChild(form);
    form.submit();
}

function MoveTetrominoDown() {
    direction = DIRECTION.DOWN;
    if (!CheckForVerticalCollision()) {
        DeleteTetromino();
        startY++;
        DrawTetromino();
    } else {
        if (startY <= 1) {
            winOrLose = "Game Over";
            ctx.fillStyle = 'white';
            ctx.fillRect(310, 242, 140, 30);
            ctx.fillStyle = 'black';
            ctx.fillText(winOrLose, 310, 261);

            let playerName = prompt("Game Over! Enter your name:");
            if (playerName) {
                saveHighScore(playerName, score);
            } else {
                window.location.href = "index.php";
            }

        } else {
            for (let i = 0; i < curTetromino.length; i++) {
                let x = curTetromino[i][0] + startX;
                let y = curTetromino[i][1] + startY;
                stopShapeArray[x][y] = curTetrominoColor; // Fix indexing: stopShapeArray[y][x] instead of stopShapeArray[x][y]
            }
            CheckForCompleteRows();
            CreateTetromino();

            direction = DIRECTION.IDLE;
            startX = 4;
            startY = 0;
            DrawTetromino();
        }
    }
}


window.setInterval(function () {
    if (winOrLose != "Game Over") {
        MoveTetrominoDown();
    }
}, 1000);

function DeleteTetromino() {
    for (let i = 0; i < curTetromino.length; i++) {
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;

        gBArray[x][y] = 0; // Fix indexing: gBArray[y][x] instead of gBArray[x][y]
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
        ctx.fillStyle = 'white';
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}

function CreateTetrominos() {
    tetrominos.push([[1, 0], [0, 1], [1, 1], [2, 1]]); // T
    tetrominos.push([[0, 0], [1, 0], [2, 0], [3, 0]]); // I
    tetrominos.push([[0, 0], [0, 1], [1, 1], [2, 1]]); // J
    tetrominos.push([[0, 0], [1, 0], [0, 1], [1, 1]]); // O
    tetrominos.push([[2, 0], [0, 1], [1, 1], [2, 1]]); // L
    tetrominos.push([[1, 0], [2, 0], [0, 1], [1, 1]]); // S
    tetrominos.push([[0, 0], [1, 0], [1, 1], [2, 1]]); // Z
}

function CreateTetromino() {
    let randomTetromino = Math.floor(Math.random() * tetrominos.length);
    curTetromino = tetrominos[randomTetromino];
    curTetrominoColor = tetrominoColors[randomTetromino];
}

function HitWall() {
    for (let i = 0; i < curTetromino.length; i++) {
        let newX = curTetromino[i][0] + startX;
        if (newX <= 0 && direction === DIRECTION.LEFT) {
            return true;
        } else if (newX >= 11 && direction === DIRECTION.RIGHT) {
            return true;
        }
    }
    return false;
}

function CheckForVerticalCollision() {
    let tetrominoCopy = curTetromino;
    let collision = false;

    for (let i = 0; i < tetrominoCopy.length; i++) {
        let x = tetrominoCopy[i][0] + startX;
        let y = tetrominoCopy[i][1] + startY;
        if (direction === DIRECTION.DOWN) {
            y++;
        }
        if (y >= gBArrayHeight || stopShapeArray[x] && stopShapeArray[x][y] !== 0) {
            collision = true;
            break;
        }
    }
    return collision;
}

function CheckForHorizontalCollision() {
    let tetrominoCopy = curTetromino;
    let collision = false;
    for (let i = 0; i < tetrominoCopy.length; i++) {
        let x = tetrominoCopy[i][0] + startX;
        let y = tetrominoCopy[i][1] + startY;
        if (direction === DIRECTION.LEFT) {
            x--;
        } else if (direction === DIRECTION.RIGHT) {
            x++;
        }
        if (stopShapeArray[x] && stopShapeArray[x][y] !== 0) {
            collision = true;
            break;
        }
    }
    return collision;
}

function CheckForCompleteRows() {
    let rowsToDelete = 0;
    let startOfDeletion = 0;
    for (let y = 0; y < gBArrayHeight; y++) {
        let completed = true;
        for (let x = 0; x < gBArrayWidth; x++) {
            if (stopShapeArray[x][y] === 0) {
                completed = false;
                break;
            }
        }
        if (completed) {
            if (startOfDeletion === 0) startOfDeletion = y;
            rowsToDelete++;

            for (let x = 0; x < gBArrayWidth; x++) {
                stopShapeArray[x][y] = 0;
                gBArray[x][y] = 0;

                let coorX = coordinateArray[x][y].x;
                let coorY = coordinateArray[x][y].y;
                ctx.fillStyle = 'white';
                ctx.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
    if (rowsToDelete > 0) {
        score += 10;
        ctx.fillStyle = 'white';
        ctx.fillRect(310, 109, 140, 19);
        ctx.fillStyle = 'black';
        ctx.fillText(score.toString(), 310, 127);
        MoveAllRowsDown(rowsToDelete, startOfDeletion);
    }
}

function MoveAllRowsDown(rowsToDelete, startOfDeletion) {
    for (let i = startOfDeletion - 1; i >= 0; i--) {
        for (let x = 0; x < gBArrayWidth; x++) {
            let y2 = i + rowsToDelete;
            let square = stopShapeArray[x][i];
            let nextSquare = stopShapeArray[x][y2];

            if (square !== 0) {
                stopShapeArray[x][y2] = square;
                gBArray[x][y2] = 1;

                let coorX = coordinateArray[x][y2].x;
                let coorY = coordinateArray[x][y2].y;
                ctx.fillStyle = square;
                ctx.fillRect(coorX, coorY, 21, 21);

                stopShapeArray[x][i] = 0;
                gBArray[x][i] = 0;

                coorX = coordinateArray[x][i].x;
                coorY = coordinateArray[x][i].y;
                ctx.fillStyle = 'white';
                ctx.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
}


function RotateTetromino() {
    let newRotation = [];
    let tetrominoCopy = curTetromino;
    let curTetrominoBU = [...curTetromino];

    for (let i = 0; i < tetrominoCopy.length; i++) {
        let x = tetrominoCopy[i][0];
        let y = tetrominoCopy[i][1];
        let newX = (GetLastSquareX() - y);
        let newY = x;
        newRotation.push([newX, newY]);
    }

    DeleteTetromino();

    try {
        curTetromino = newRotation;
        DrawTetromino();
    } catch (e) {
        if (e instanceof TypeError) {
            curTetromino = curTetrominoBU;
            DeleteTetromino();
            DrawTetromino();
        }
    }
}

function GetLastSquareX() {
    let lastX = 0;
    for (let i = 0; i < curTetromino.length; i++) {
        let square = curTetromino[i];
        if (square[0] > lastX) {
            lastX = square[0];
        }
    }
    return lastX;
}

function CreateNextTetromino() {
    let randomTetromino = Math.floor(Math.random() * tetrominos.length);
    nextTetromino = tetrominos[randomTetromino];
    nextTetrominoColor = tetrominoColors[randomTetromino];
    DrawNextTetromino();
}

function DrawNextTetromino() {
    // Clear previous next tetromino area
    ctx.fillStyle = 'white';
    ctx.fillRect(310, 146, 140, 90);

    // Draw next tetromino
    for (let i = 0; i < nextTetromino.length; i++) {
        let x = nextTetromino[i][0] * 21 + 350;
        let y = nextTetromino[i][1] * 21 + 170;

        ctx.fillStyle = nextTetrominoColor;
        ctx.fillRect(x, y, 21, 21);
    }
}
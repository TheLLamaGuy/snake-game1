// Define HTML elements
const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById('logo');
const score = document.getElementById('score')
const highScoreText = document.getElementById('highScore')

// Define game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200; // in milliseconds
let gameStarted = false;
let highScore = 0;

// Draw game map, snake, food
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
}

// Draw snake
function drawSnake() {
    for (let i = 0; i < snake.length; i += 1) {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, snake[i])
        board.appendChild(snakeElement);
    }
}

// Create a snake or food cube/div
function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

// Set the position of the snake or food
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

// Draw food function
function drawFood() {
    if (gameStarted) {
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement)
    }
}

// Generate food
function generateFood() {
    
    let x;
    let y;
    let foodPlaces;

    while (true) {
        console.log(1)
        foodPlaces = -0; // count of how many times food is on snakes

        x = Math.floor(Math.random() * gridSize) + 1;
        y = Math.floor(Math.random() * gridSize) + 1;
        
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === x && snake[i].y === y) {
                foodPlaces++
            }
        }
        
        // breaks and returns x and y when food is not on snake
        if (foodPlaces == 0) {
            return { x, y };
        }


        // there will be no space to spawn food so reset game, you have won the game
        if (snake.length === 400) {
            resetGame();
            alert("Congratulations! You won the game.");
            return;
        }

    }

}

function increaseSpeed() {
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 0.5;
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    }
}

function checkCollision() {
    const head = snake[0];


    // reset game if snake touches the border
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame();
    }

    // reset snake if touches itself
    if (snake.length > 1) {
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                resetGame()
            }
        }
    }
}


// Moving the snake
function move() {
    const head = { ...snake[0] };
    switch (direction) {
        case 'up':
            head.y--
            break;
        case 'down':
            head.y++
            break;
        case 'right':
            head.x++
            break;
        case 'left':
            head.x--
            break;
    }

    // updating snake array
    // tempSnake = head coordinates + snake coordinates | same as .unshift() method
    let tempSnake = [head];
    for (i = 1; i < snake.length + 1; i++) {
        tempSnake[i] = snake[i - 1];
    }
    snake = tempSnake;

    // if head touches food then size grows
    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval); // clear past interval
        gameInterval = setInterval(() => {
            move(); // Move first
            checkCollision();
            updateScore();
            draw(); // Then draw again new position
        }, gameSpeedDelay);
    } else {
        snake.length = snake.length - 1; // removes the last element from the snake | same as .pop() method
    }
}

function updateScore() {
    const currentScore = snake.length - 1; // default snake is size 1
    score.textContent = currentScore.toString().padStart('3', '0')
}

function updateHighScore() {
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0')
    }
    highScoreText.style.display = 'block';
}

function stopGame() {
    clearInterval(gameInterval)
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

function resetGame() {
    updateHighScore();
    stopGame();
    snake = [{ x: 10, y: 10 }];
    food = generateFood()
    direction = 'right';
    gameSpeedDelay = 200;
}

// Start game function
function startGame() {
    gameStarted = true; // keep track of a running game
    instructionText.style.display = 'none'; // stops showing the picture
    logo.style.display = 'none'; // stops showing the text
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

// keypress event listener
function handleKeyPress(event) {
    if ((!gameStarted && event.code === 'Space') ||
        (!gameStarted && event.code === ' ')
    ) {
        startGame();
    } else {
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
        }
    }
}

document.addEventListener('keydown', handleKeyPress);


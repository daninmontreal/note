var snake = [];
const dd = 10;
var foodX, foodY;
var dx = 10, dy = 0;
var speed = 300;
var changingDirection = false;
var score = 0;
var ready = false;
function randomTen(min, max) { return Math.round((Math.random() * (max - min) + min) / dd) * dd; }

function createFood(gameCanvas) {
  foodX = randomTen(0, gameCanvas.width - 10); foodY = randomTen(0, gameCanvas.height - 10);
  snake.forEach(function isFoodOnSnake(part) {
    const foodIsOnSnake = part.x == foodX && part.y == foodY;
    if (foodIsOnSnake)
      createFood();
  });
}

function drawFood(ctx) { ctx.fillStyle = 'red'; ctx.strokestyle = 'darkred'; ctx.fillRect(foodX, foodY, dd, dd); ctx.strokeRect(foodX, foodY, dd, dd); }

function drawGrid(ctx, canvas) {
  let x = 0;
  ctx.strokestyle = 'grey';
  while (x <= canvas.width) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
    x += dd;
  }

  x = 0;
  while (x <= canvas.height) {
    ctx.beginPath();
    ctx.moveTo(0, x);
    ctx.lineTo(canvas.width, x);
    ctx.stroke();
    x += dd;
  }
}

function gameOver(canvas, ctx) {
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y)
      return true;
  }

  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > canvas.width - dd;
  const hitToptWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > canvas.height - dd;

  return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}

function startSnake(restarted = false) {
  let divOfCanvas = document.getElementById("snake");
  let canvas = document.getElementById("snakeCanvas");
  let ctx = canvas.getContext("2d");
  let refresh = () => {
    clear(canvas, ctx);
    drawGrid(ctx, canvas);
    drawSnake(canvas, ctx, divOfCanvas);
    drawFood(ctx);
  }

  if (!restarted) {
    canvas.width = divOfCanvas.offsetWidth;
    canvas.height = divOfCanvas.offsetHeight;

    let x = canvas.width / 2;
    let y = canvas.height / 2;
    snake = [{ x: x, y: y }, { x: x - dd, y: y }, { x: x - 2 * dd, y: y }, { x: x - 3 * dd, y: y }, { x: x - 4 * dd, y: y },];
    console.log(snake);
    createFood(canvas);
    refresh();
    divOfCanvas.addEventListener("keydown", changeDirection);
    divOfCanvas.addEventListener("focus", (event)=> {
      ready = true;      
    });
  }

  setTimeout(function onTick() {
    if(!ready){
      startSnake(true); 
      return;
    }
    changingDirection = false;
    step(canvas, ctx, divOfCanvas, dx, dy);
    refresh();
    if (gameOver(canvas, ctx)) {
      alert(`Game is Over, you score is: ${score}`);
      //startSnake();
      return;
    }
    startSnake(true);
  }, speed);
}

function drawSnake(canvas, ctx, div) {
  ctx.fillStyle = 'lightgreen'; ctx.strokestyle = 'darkgreen';
  let drawRect = (snakePart) => {
    ctx.fillRect(snakePart.x, snakePart.y, dd, dd);
    ctx.strokeRect(snakePart.x, snakePart.y, dd, dd);
  };
  snake.forEach(drawRect);
}

function step(canvas, ctx, div, dx, dy) {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);
  const didEatFood = snake[0].x === foodX && snake[0].y === foodY;  
  if (didEatFood) {
    score += 1;
    speed -= 10;    
    createFood(canvas);  
  } else {    
    snake.pop();  
  }
}

function clear(canvas, ctx) {
  ctx.fillStyle = "white"; ctx.strokeStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function changeDirection(event) {
  const LEFT_KEY = 37; const RIGHT_KEY = 39; const UP_KEY = 38; const DOWN_KEY = 40;
  event.preventDefault();
  if(changingDirection) return;
  changingDirection = true;
  let divOfCanvas = document.getElementById("snake");
  if (document.activeElement != divOfCanvas) {
    return;
  }

  const keyPressed = event.keyCode;

  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;

  if (keyPressed === LEFT_KEY && !goingRight) { dx = -10; dy = 0; }
  if (keyPressed === UP_KEY && !goingDown) { dx = 0; dy = -10; }
  if (keyPressed === RIGHT_KEY && !goingLeft) { dx = 10; dy = 0; }
  if (keyPressed === DOWN_KEY && !goingDown) { dx = 0; dy = 10; }

}

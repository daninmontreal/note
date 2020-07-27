
var x;
var y;
var dx = 2;
var dy = -2;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX =0 ;
var rightPressed = false;
var leftPressed = false;
var timerInernal;

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function withBounceContext(fn) {
    const div = document.getElementById("bounce");
    const canvas = document.getElementById("bounceCanvas");
    const ctx = canvas.getContext("2d");
    fn(div, canvas, ctx);
}

function startBounce() {
    withBounceContext((div, canvas, ctx) => {
        canvas.height = div.offsetWidth;
        canvas.width = div.offsetHeight;
        x = canvas.width / 2;
        y = canvas.height - 100;
        paddleX = (canvas.width-paddleWidth)/2;

        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);

        timerInernal = setInterval(draw, 10);
    });
}

function drawBall(x, y, ballRadius) {
    withBounceContext((div, canvas, ctx) => {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    });
}

function drawPaddle() {
    withBounceContext((div, canvas, ctx) => {
        ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
    });
    
}

function draw() {
    var ballRadius = 10;
    withBounceContext((div, canvas, ctx) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall(x, y, ballRadius);
        drawPaddle();

        if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if(y + dy < ballRadius) {
            dy = -dy;
        }
        else if(y + dy > canvas.height-ballRadius) {
            if(x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            }
            else {
                alert("GAME OVER");
                document.location.reload();
                clearInterval(timerInernal); // Needed for Chrome to end game
            }
        }
        
        if(rightPressed && paddleX < canvas.width-paddleWidth) {
            paddleX += 7;
        }
        else if(leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        x += dx;
        y += dy;
    });
}

/*
if (document.readyState != "loading") {
    //startBounce();
} else {
    document.addEventListener("DOMContentLoaded", () => {
        //startBounce();
    })
}*/
/*
$(document).ready(()=>{
    startBounce();
});*/

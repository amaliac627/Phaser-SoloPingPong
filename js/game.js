// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 1000 / 60);
        };
})();

window.cancelRequestAnimFrame = (function () {
    return window.cancelAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.oCancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFrame ||
        clearTimeout;
})();
//do not touch code above

//Step 1...awc...create game canvas and track mouse position
var gameCanvas = document.getElementById("canvas");
//store HTML5 canvas tag into JS variable

var ctx = gameCanvas.getContext("2d"); //create contact 2D

var W = window.innerWidth;
var H = window.innerHeight;
var mouseObj = {};

//console.log('browser width is currently:' + W);
//console.log('browser height is currently:' + H);

gameCanvas.width = W;
gameCanvas.height = H;

//Step 02..awc..clear page canvas by covering it in black
function paintCanvas() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);
}
paintCanvas();


function trackPosition(evt) {
    mouseObj.x = evt.pageX;
    mouseObj.y = evt.pageY;
    // console.log("cursor x is:" + mouseObj.x + "cursor y is:" + mouseObj.y);
}
gameCanvas.addEventListener("mousemove", trackPosition, true);

//Step 02..awc..Place a ball on the canvas
var ball = {}; //Ball Object, curly brackets=object
ball = {
    x: 50, //reference later by ball.x
    y: 50,
    r: 5,
    c: "#ffffff",
    vx: 8,
    vy: 4,

    draw: function () {
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false); //start angle=0
        ctx.fill();
    }
}
ball.draw();

//Step 04..awc..Place a start button on canvas
var startBtn = {}; //Start button Object
startBtn = {
    w: 100,
    h: 50,
    x: W / 2 - 50, //centers button
    y: H / 2 - 90,

    draw: function () {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = "2";
        ctx.strokeRect(this.x, this.y, this.w, this.h);

        ctx.font = "18px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("Start", W / 2, H / 2 - 65);
    }
}
startBtn.draw();

var horaot = {};
horaot = {
    draw: function () {
        ctx.font = "22px, Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#fff";
        ctx.fillText("Use mouse to control paddles.", W / 2, H / 2 - 15);
    }
}

horaot.draw();

//Step 05..awc..place score and points on canvas
var points = 0; //game points
function paintScore() {
    ctx.fillStyle = "#ffffff";
    ctx.font = "18px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Score: " + points, W / 2, 20);
}
paintScore();

//step 06...awc...place paddles (top and bottom) on canvas

function paddlePosition(TB) {
    this.w = 5;
    this.h = 150;

    this.y = H / 2 - this.h / 2;

    if (TB == "left") {
        this.x = 0;
    } else {
        this.x = W - this.w;
    }
}

var paddlesArray = []; //Paddles array
paddlesArray.push(new paddlePosition("left"));
paddlesArray.push(new paddlePosition("right"));
//console.log("top paddle y is: " + paddlesArray[0].y);
//console.log("bottom paddle x is: " + paddlesArray[1].y);

function paintPaddles() {
    for (var lp = 0; lp < paddlesArray.length; lp++) {
        p = paddlesArray[lp];
        if (lp == 0) {
            ctx.fillStyle = "#00ffff";
        } else {
            ctx.fillStyle = "#00ff45";
        }
        ctx.fillRect(p.x, p.y, p.w, p.h);
    }
}
paintPaddles();

//step 07..awc...detect when user clicks on screen

gameCanvas.addEventListener("mousedown", btnClick, true);

function btnClick(evt) {
    var mx = evt.pageX;
    var my = evt.pageY;

    //user clicked on start button
    if (mx >= startBtn.x && mx <= startBtn.x + startBtn.w) {
        if (my >= startBtn.y && my <= startBtn.y + startBtn.h) {
            //console.log("Start button clicked");
            //delete the start button
            startBtn = {};

            //Start Game animation loop
            animloop();
        }
    }
    if (flagGameOver) {
        if (mx >= restartBtn.x && mx <= restartBtn.x + restartBtn.w) {
            if (my >= restartBtn.y && my <= restartBtn.y + restartBtn.h) {
                // Reset my game
                points = 0;
                ball.x = 20;
                ball.y = 20;
                ball.vx = 8;
                ball.vy = 4;

                flagGameOver = 0;
                // Start Game animation loop
                animloop();
            }
        }
    }
}

//function for running the whole game animation
var init; //variable to initialize animation

function animloop() {
    init = requestAnimFrame(animloop);
    refreshCanvasFun();
}

//step 08...awc...draw everything on canvas over and over again
function refreshCanvasFun() {
    paintCanvas();
    paintPaddles();
    ball.draw();
    paintScore();
    update();
}

function update() {
    //move the paddles, track the mouse
    for (var lp = 0; lp < paddlesArray.length; lp++) {
        p = paddlesArray[lp];
        p.y = mouseObj.y - p.h / 2;
    }
    //move the ball
    ball.x += ball.vx;
    ball.y += ball.vy;
    //check for ball paddle collition
    check4collision();
}
var color; //global var for color
function check4collision() {
    var pLeft = paddlesArray[0];
    var pRight = paddlesArray[1];

    if (collides(ball, pLeft)) {
        collideAction(ball, pLeft);
    } else if (collides(ball, pRight)) {
        collideAction(ball, pRight);
    } else {
        //ball went off the top or bottom of screen
        if (ball.x + ball.r > W) {
            //game over
            gameOver();

        } else if (ball.x < 0) {
            gameOver();
        }
        //ball hits side of screen
        if (ball.y + ball.r > H) {
            ball.vy = -ball.vy;
            ball.y = H - ball.r;
        } else if (ball.y - ball.r < 0) {
            ball.vy = -ball.vy;
            ball.y = ball.r;
        }
    }



    // SPARKLES
    if (flagCollision) {
        for (var k = 0; k < particleCount; k++) {
            particles.push(new createParticles(particlePos.x, particlePos.y, particleDir));
        }
        color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    }

    // Emit particles/sparks
    emitParticles();
    // reset flagCollision
    flagCollision = 0;
}

function createParticles(x, y, d) {
    this.x = x || 0; // equal to x or 0 if no parameter is passed in
    this.y = y || 0;

    this.radius = 2;
    this.vy = -1.5 + Math.random() * 3;
    this.vx = d * Math.random() * 1.5;
}

function emitParticles() {
    for (var j = 0; j < particles.length; j++) {
        var par = particles[j];

        ctx.beginPath();
        ctx.fillStyle = color;
        if (par.radius > 0) {
            ctx.arc(par.x, par.y, par.radius, 0, Math.PI * 2, false);
        }
        ctx.fill();

        par.x += par.vx;
        par.y += par.vy;

        // Reduce radius of particle so that it dies after a few seconds
        par.radius = Math.max(par.radius - 0.05, 0.0);
    }
}
var paddleHit; //Which paddle was hit 0=top, 1=bottom
function collides(b, p) {
    if (b.y + b.r >= p.y && b.y - b.r <= p.y + p.h) {
        if (b.x >= (p.x - p.w) && p.x > 0) {
            paddleHit = 0;
            return true;
        } else if (b.x <= p.w && p.x === 0) {
            paddleHit = 1;

            return true;
        } else {
            return false;
        }
    }
}

var collisionSnd = document.getElementById("collide");

function collideAction(b, p) {
    // console.log("sound and then bounce");
    if (collisionSnd) {
        collisionSnd.play();
    }
    //reverse ball y velocity
    ball.vx = -ball.vx;

    if (paddleHit == 0) {
        ball.x = p.x - p.w;
        particlePos.x = ball.x + ball.r;
        particleDir = -1;
    } else if (paddleHit == 1) {
        ball.x = p.w + ball.r;
        particlePos.x = ball.x - ball.r;
        particleDir = 1;
    }
    //increase the score by 1
    points++;
    increaseSpd();

    //sparkles
    particlePos.y = ball.y;
    flagCollision = 1;

    shrinkPaddles();
}

var flagCollision = 0;
var particles = [];
var particlePos = {};
var particleDir = 1;
var particleCount = 20;

function increaseSpd() {
    // increase ball speed after every 4 points
    if (points % 4 === 0) {
        if (Math.abs(ball.vy) < 15) { // add an upper limit to the speed of the ball
            ball.vx += (ball.vx < 0) ? -2 : 2; // if the ball is going left, then increase it going left. otherwise, increase it by one going right
            ball.vy += (ball.vy < 0) ? -1 : 1; // Up faster by two vs down faster by two
        }
    }
}

function shrinkPaddles() {
    //shrink paddle after every 4 points
    if (points % 4 === 0) {
        for (var smalls = 0; smalls < paddlesArray.length; smalls++) {
            paddlesArray[smalls].h -= 5;
        }

    }
}

var flagGameOver = 0;
// Function to run when the game is over
function gameOver() {
    // console.log("Game is over");

    // Display final score
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Game Over - You scored " + points + " points!", W / 2, H / 2 + 25);

    // Stop the animation
    cancelRequestAnimFrame(init);

    // Display replay button
    restartBtn.draw();

    // Set the game over flag
    flagGameOver = 1;
}
var restartBtn = {}; // Restart button object
restartBtn = {
    w: 100,
    h: 50,
    x: W / 2 - 50,
    y: H / 2 - 50,

    draw: function () {
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = "2";
        ctx.strokeRect(this.x, this.y, this.w, this.h);

        ctx.font = "18px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#fff";
        ctx.fillText("RESTART", W / 2, H / 2 - 25);
    }
}

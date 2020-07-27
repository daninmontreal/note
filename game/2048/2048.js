
var map2048 = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

function full(){
    ret = true;
    map2048.forEach((e)=>{
        e.forEach((v)=>{
            if(v == 0)
                ret = false;
        })
    });
    return ret;
}

const colorMap2048 = [[0, '#ccc'], [2, '#eee4da'], [4, '#ece0c8'], [8, '#f1b078'], [16, '#ee8c4f'], [32, '#f57c5f'], [64, '#e85939'], [128, '#f2d86a'], [256, '#eeca30'], [512, '#e1c229'], [1024, '#e2b913'], [2048, '#ecc400']
];

const colorizeSpace = (row, column) => {
    const [, hex] = colorMap2048.find(([val,]) => map2048[row][column] == val);
    document.getElementsByClassName("item_" + column + row)[0].style.background = hex;
    const [val,] = colorMap2048.find(([val,]) => map2048[row][column] == val)
    if (val != 0) document.getElementsByClassName("item_" + column + row)[0].innerHTML = val;
};

function draw() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (map2048[j][i] == '0') document.getElementsByClassName("item_" + i + j)[0].innerHTML = '';
            colorizeSpace(i, j);
        }
    }
}

function myRandom() {
    var ranX = Math.floor(Math.random() * 4);
    var ranY = Math.floor(Math.random() * 4);
    var ran = Math.floor(Math.random() * 2);
    if (map2048[ranX][ranY] == '0') {
        if (ran == 1) {
            map2048[ranX][ranY] = '2';
            console.log("Random add 2 - cords " + ranX + "," + ranY);
        }
        else {
            map2048[ranX][ranY] = '4';
            console.log("Random add 4 - cords " + ranX + "," + ranY);
        }
    }
    else if(full()) {
        alert("Game Over! you lost");
    }
    else    
        myRandom();
}

const movevertival = (a, b, c, d, e) => {
    if (map2048[a][b] == '0') {
        map2048[a][b] = map2048[c][b];
        map2048[c][b] = '0';
    }
    if (map2048[c][b] == '0') {
        map2048[c][b] = map2048[d][b];
        map2048[d][b] = '0';
        if (map2048[a][b] == '0') {
            map2048[a][b] = map2048[c][b];
            map2048[c][b] = '0';
        }
    }
    if (map2048[d][b] == '0') {
        map2048[d][b] = map2048[e][b];
        map2048[e][b] = '0';
        if (map2048[c][b] == '0') {
            map2048[c][b] = map2048[d][b];
            map2048[d][b] = '0';
            if (map2048[a][b] == '0') {
                map2048[a][b] = map2048[c][b];
                map2048[c][b] = '0';
            }
        }
    }
}

const mevehorizontal = (a, b, c, d, e) => {
    if (map2048[a][b] == '0') {
        map2048[a][b] = map2048[a][c];
        map2048[a][c] = '0';
    }
    if (map2048[a][c] == '0') {
        map2048[a][c] = map2048[a][d];
        map2048[a][d] = '0';
        if (map2048[a][b] == '0') {
            map2048[a][b] = map2048[a][c];
            map2048[a][c] = '0';
        }
    }
    if (map2048[a][d] == '0') {
        map2048[a][d] = map2048[a][e];
        map2048[a][e] = '0';
        if (map2048[a][c] == '0') {
            map2048[a][c] = map2048[a][d];
            map2048[a][d] = '0';
            if (map2048[a][b] == '0') {
                map2048[a][b] = map2048[a][c];
                map2048[a][c] = '0';
            }
        }
    }
}

function down() {
    for (var i = 0; i <= 3; i++) {
        movevertival(3, i, 2, 1, 0);
        for (var j = 3; j > 0; j--) {
            if (map2048[j][i] == map2048[j - 1][i]) {
                map2048[j][i] *= 2;
                map2048[j - 1][i] = '0';
            }
        }
        movevertival(3, i, 2, 1, 0);
    }

}

function up() {
    for (var i = 3; i >= 0; i--) {
        movevertival(0, i, 1, 2, 3);
        for (var j = 0; j < 3; j++) {
            if (map2048[j][i] == map2048[j + 1][i]) {
                map2048[j][i] *= 2;
                map2048[j + 1][i] = 0;
            }
        }
        movevertival(0, i, 1, 2, 3);
    }
}

function left() {
    for (var i = 3; i >= 0; i--) {
        mevehorizontal(i, 0, 1, 2, 3);
        for (var j = 0; j < 3; j++) {
            if (map2048[i][j] == map2048[i][j + 1]) {
                map2048[i][j] *= 2;
                map2048[i][j + 1] = 0;
            }
        }
        mevehorizontal(i, 0, 1, 2, 3);
    }
}

function right() {
    for (var i = 0; i <= 3; i++) {
        mevehorizontal(i, 3, 2, 1, 0);
        for (var j = 3; j > 0; j--) {
            if (map2048[i][j] == map2048[i][j - 1]) {
                map2048[i][j] *= 2;
                map2048[i][j - 1] = '0';
            }
        }
        mevehorizontal(i, 3, 2, 1, 0);
    }
}

function check() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (map2048[i][j] == '2048') alert("YOU WIN!")
        }
    }
}

function rand_draw_check() {
    myRandom();
    draw();
    check();
}

function init2048() {
    console.log("Init 2048 Game board");
    myRandom();
    myRandom();
    draw();

    let div = document.getElementById("game2048");
    let isRunning = true;
    
    window.addEventListener('keydown', function (event) {
        if(!isRunning)
            return;
        event.preventDefault();
        switch (event.keyCode) {
            case 37: // Left
                left();
                rand_draw_check();
                break;
            case 38: // Up
                up();
                rand_draw_check()
                break;
            case 39: // Right
                right();
                rand_draw_check();
                break;
            case 40: // Down
                down();
                rand_draw_check();
                break;
        }
    }, false);

    var main = div;
	var hammer = new Hammer.Manager(main);
	var swipe = new Hammer.Swipe({ direction: Hammer.DIRECTION_ALL });
	hammer.add(swipe);

	hammer.on("swipeleft", function (evenet) {
        if(!isRunning)
            return;
		left();
		rand_draw_check();
	});

	hammer.on("swiperight", function (evenet) {
        if(!isRunning)
            return;
		right();
		rand_draw_check();
	});

	hammer.on("swipeup", function (evenet) {
        if(!isRunning)
            return;
		up();
		rand_draw_check();
	});

	hammer.on("swipedown", function (evenet) {
        if(!isRunning)
            return;
		down();
		rand_draw_check();
	})

}

if (document.readyState != 'loading') {
    init2048();
} else {
    window.addEventListener('DOMContentLoaded', init2048);
}
var blockTimeSpan = 500;
var blockSize = 10;
var blockReady = false;
var blockTimer;
var initPos = { left: 0, top: 0 };
var sceneBound = { w: 0, h: 0 };
var currBlock;
var blockScene;

function onContext(cb) {
    let divOfBlock = document.getElementById("block");
    let canvas = document.getElementById("blockCanvas");
    let ctx = canvas.getContext("2d");
    return cb(divOfBlock, canvas, ctx);
}

function drawBlockGrid(canvas, ctx) {
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

function clearBlockCanvas(canvas, ctx) {
    ctx.fillStyle = "white"; ctx.strokeStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

class BlockScene {
    constructor(bound, cellw) {
        this.bound = bound;
        this.showGrid = true;
        this.cellw = cellw;
        this.bitmaps = [];
        for (let i = 0; i < bound.h; i++) {
            this.bitmaps.push([]);
            for (let j = 0; j < bound.w; j++) {
                this.bitmaps[i].push(0);
            }
        }
        //console.log(this.bitmaps);
    }

    iter(cb) {
        let grid = this.bitmaps
        for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[r].length; c++) {
                if (grid[r][c] == 1) {
                    cb(r, c, { x: c * this.cellw, y: r * this.cellw })
                }
            }
        }
    }

    width() {
        return this.bound.w;
    }

    height() {
        return this.bound.h;
    }

    valid(blk) {
        let ret = true;
        blk.iter((r, c, b) => {
            if (r >= 0 && r < this.bound.h && c >= 0 && c < this.bound.w) {
                if (this.bitmaps[r][c] == 1) {
                    ret = false;
                }
            }
        });
        return ret;
    }

    drawBlock(blk) {
        blk.iter((r, c, b) => {
            if (r >= 0 && r < this.bound.h && c >= 0 && c < this.bound.w) {
                this.bitmaps[r][c] = 1;
            }
        });

        //TODO: do clear
    }

    draw() {
        onContext((div, canvas, ctx) => {
            clearBlockCanvas(canvas, ctx);
            if (this.showGrid)
                drawBlockGrid(canvas, ctx);
            currBlock.draw();
            this.iter((r, c, bound) => {
                let drawRect = (blk) => {
                    ctx.fillRect(blk.x, blk.y, this.cellw, this.cellw);
                    ctx.strokeRect(blk.x, blk.y, this.cellw, this.cellw);
                };
                drawRect(bound);
            });
        })
    }
}

class Block {
    constructor(pos, cellw, scence) {
        this.pos = { left: 0, top: 0 };
        this.cellw = cellw;
        this.scence = scence;
        this.pos.left = pos.left - 2;
        this.pos.top = pos.top - 2;
        this.bitmaps = [];
        this.index = 0;
        this.speed = blockTimeSpan;
        this.status = true;
    }

    rotate() {
        let oldIndex = this.index
        this.index = (this.index + 1) % this.bitmaps.length;
        if ((this.left() < 0) || (this.right() > (this.scence.width() - 1)) || (this.bottom() > (this.scence.height() - 1))) {
            this.index = oldIndex;
            return;
        }

        this.index = (oldIndex + 1) % this.bitmaps.length;
        if (!this.scence.valid(this)) {
            this.index = oldIndex;
            return;
        }
    }

    move_down(offset = 1) {
        let oldPosTop = this.pos.top;
        this.pos.top += offset;
        if (!this.scence.valid(this)) {
            this.pos.top = oldPosTop;
            this.status = false;
            return false;
        }

        this.pos.top = oldPosTop;
        if (this.bottom() == (this.scence.height() - 1)) {
            this.status = false;
            return false;
        }
        this.pos.top += offset;
        this.status = true;
        return true;
    }

    move_left() {
        let oldleft = this.pos.left;
        this.pos.left--;
        if (!this.scence.valid(this)) {
            this.pos.left = oldleft;
            return;
        }
        this.pos.left = oldleft;

        if (this.left() == 0) return;
        this.pos.left--;
    }

    move_right() {
        let oldleft = this.pos.left;
        this.pos.left++;
        if (!this.scence.valid(this)) {
            this.pos.left = oldleft;
            return;
        }
        this.pos.left = oldleft;

        if (this.right() == (this.scence.width() - 1)) return;
        this.pos.left++;
    }

    iter(cb) {
        let grid = this.bitmaps[this.index];
        for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[r].length; c++) {
                if (grid[r][c] == 1) {
                    cb(this.pos.top + r, this.pos.left + c, { x: (this.pos.left + c) * this.cellw, y: (this.pos.top + r) * this.cellw })
                }
            }
        }
    }

    left() {
        let min_left = this.scence.width();
        this.iter((row, col, bound) => {
            min_left = Math.min(col, min_left);
        });
        return min_left;
    }

    right() {
        let max_right = 0;
        this.iter((row, col, bound) => {
            max_right = Math.max(col, max_right);
        });
        return max_right;
    }

    bottom() {
        let max_top = 0;
        this.iter((row, col, bound) => {
            max_top = Math.max(max_top, row);
        });
        return max_top;
    }

    draw() {
        onContext((div, canvas, ctx) => {
            ctx.fillStyle = 'lightgreen'; ctx.strokestyle = 'darkgreen';
            this.iter((r, c, bound) => {
                let drawRect = (blk) => {
                    ctx.fillRect(blk.x, blk.y, this.cellw, this.cellw);
                    ctx.strokeRect(blk.x, blk.y, this.cellw, this.cellw);
                };
                drawRect(bound);
            });
        });
    }
};

class BlockI extends Block {
    constructor(pos, cellw, scence) {
        super(pos, cellw, scence);
        this.bitmaps.push([[0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0]]);
        this.bitmaps.push([[0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]]);
    }
};

class BlockT extends Block {
    constructor(pos, cellw, scence) {
        super(pos, cellw, scence);
        this.bitmaps.push([[0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]]);
        this.bitmaps.push([[0, 1, 0],
        [1, 1, 0],
        [0, 1, 0]]);
        this.bitmaps.push([[0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]]);
        this.bitmaps.push([[0, 1, 0],
        [0, 1, 1],
        [0, 1, 0]]);
    }
};

class BlockL extends Block {
    constructor(pos, cellw, scence) {
        super(pos, cellw, scence);
        this.bitmaps.push([[0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]]);
        this.bitmaps.push([[0, 0, 0],
        [1, 1, 1],
        [1, 0, 0]]);
        this.bitmaps.push([[1, 1, 0],
        [0, 1, 0],
        [0, 1, 0]]);
        this.bitmaps.push([[0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]]);
    }
};

class BlockJ extends Block {
    constructor(pos, cellw, scence) {
        super(pos, cellw, scence);
        this.bitmaps.push([[0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]]);
        this.bitmaps.push([[1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]]);
        this.bitmaps.push([[0, 1, 1],
        [0, 1, 0],
        [0, 1, 0]]);
        this.bitmaps.push([[0, 0, 0],
        [1, 1, 1],
        [0, 0, 1]]);
    }
};

class BlockZ extends Block {
    constructor(pos, cellw, scence) {
        super(pos, cellw, scence);
        this.bitmaps.push([[1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]]);
        this.bitmaps.push([[0, 0, 1],
        [0, 1, 1],
        [0, 1, 0]]);
    }
};

class BlockRZ extends Block {
    constructor(pos, cellw, scence) {
        super(pos, cellw, scence);
        this.bitmaps.push([[0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]]);
        this.bitmaps.push([[0, 1, 0],
        [0, 1, 1],
        [0, 0, 1]]);
    }
};

function createBlock(scence) {
    const blockCreaters = [(pos, cellw, scence) => {
        return new BlockI(pos, cellw, scence);
    },
    (pos, cellw, scence) => {
        return new BlockT(pos, cellw, scence);
    },
    (pos, cellw, scence) => {
        return new BlockL(pos, cellw, scence);
    },
    (pos, cellw, scence) => {
        return new BlockJ(pos, cellw, scence);
    },
    (pos, cellw, scence) => {
        return new BlockZ(pos, cellw, scence);
    },
    (pos, cellw, scence) => {
        return new BlockRZ(pos, cellw, scence);
    }];

    return blockCreaters[randomInteger(0, blockCreaters.length)](initPos, blockSize, scence);
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function startBlockTimer(div, canvas, ctx) {
    if (!blockReady) return;
    blockTimer = setTimeout(() => {
        currBlock.move_down();
        if (!currBlock.status) {
            blockScene.drawBlock(currBlock);
            currBlock = createBlock(blockScene);
        }
        blockScene.draw();
        startBlockTimer(div, canvas, ctx);

    }, currBlock.speed);
}

function startBlock() {
    onContext((div, canvas, ctx) => {
        canvas.width = div.offsetWidth;
        canvas.height = div.offsetHeight;
        sceneBound.w = Math.floor(canvas.width / blockSize);
        sceneBound.h = Math.floor(canvas.height / blockSize);
        canvas.width = sceneBound.w * blockSize;
        canvas.height = sceneBound.h * blockSize;
        initPos.left = Math.floor(sceneBound.w / 2);
        initPos.top = 0;
        blockScene = new BlockScene(sceneBound, blockSize);
        currBlock = createBlock(blockScene);
        div.addEventListener("focus", () => {
            blockReady = true;
            startBlockTimer(div, canvas, ctx);
        });
        div.addEventListener("focusout", () => {
            blockReady = false;
            clearTimeout(blockTimer);
        });

        let eventCB = (event, keyPressed)=>{
            const LEFT_KEY = 37; const RIGHT_KEY = 39; const UP_KEY = 38; const DOWN_KEY = 40;
            event.preventDefault();
            if (document.activeElement != div) {
                return;
            }

            if (keyPressed === LEFT_KEY) {
                currBlock.move_left();
                blockScene.draw();
            }
            if (keyPressed === UP_KEY) {
                currBlock.rotate();
                blockScene.draw();
            }
            if (keyPressed === RIGHT_KEY) {
                currBlock.move_right();
                blockScene.draw();
            }
            if (keyPressed === DOWN_KEY) {
                currBlock.move_down();
                blockScene.draw();
            }
        }
        div.addEventListener("keydown", (event) => {
            eventCB(event, event.keyCode); 
        });

        var hammerOfBlock = new Hammer.Manager(div);
        hammerOfBlock.add(new Hammer.Swipe({ direction: Hammer.DIRECTION_ALL }));

        hammerOfBlock.on("swipeleft", function (event) {
            eventCB(event, 37);
        });

        hammerOfBlock.on("swiperight", function (event) {
            eventCB(event, 39);
        });

        hammerOfBlock.on("swipeup", function (event) {
            eventCB(event, 38);
        });

        hammerOfBlock.on("swipedown", function (event) {
            eventCB(event, 40);
        })

    });
}

if (document.readyState != 'loading') {
    startBlock();
} else {
    window.addEventListener('DOMContentLoaded', () => {
        startBlock();
    });
}
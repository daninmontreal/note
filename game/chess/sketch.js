const CELLSIZE = 80;
var CHESS_COLOR;
let chess;
let pieces = [];
let wKing;
let bKing;
let wlRook;
let wrRook;
let blRook;
let brRook;
let currPiece = undefined;


function findPiece(r, c) {
  return pieces.find(e => e.row == r && e.col == c);
}

const ChessType = {
  Animi: 1,
  Self: 0
};

let nowPlayer = ChessType.Self;

class Piece {

  constructor(x, y, tp, tag, img) {
    this.row = x;
    this.col = y;
    this.tp = tp;
    this.tag = tag;
    this.img = img;
    this.moved = false;
  }

  isMate() {
    let king = this.tp == ChessType.Self ? wKing : bKing;
    let mated = false;
    pieces.forEach(p => {
      if (p.tp != king.tp && (p != king)) {
        if (p.valid(king.row, king.col))
          mated = true;
      }
    });
    return mated;
  }

  valid(row, col) {

    if (row < 0 || row > 7) return false;
    if (col < 0 || col > 7) return false;
    if(this.row == row && this.col == col) return false;
    let v = findPiece(row, col);
    if (v) {
      if (v.tp == this.tp)
        return false;
    }
    return true;
  }

  _move(row, col) {
    this.row = row;
    this.col = col;
    this.moved = true;
  }

  move(row, col) {
    if (this.tp != nowPlayer)
      return false;

    if (!this.valid(row, col)) {
      return false;
    }

    let r = this.row;
    let c = this.col;
    let piece = findPiece(row, col);

    for (let i = 0; i < pieces.length; i++) {
      if (pieces[i].row == row && pieces[i].col == col) {
        pieces.splice(i, 1);
      }
    }

    this.row = row;
    this.col = col;

    if (this.isMate()) {
      this.row = r;
      this.col = c;
      if(piece)
        pieces.push(piece);
      return false;
    }

    if (nowPlayer == ChessType.Self)
      nowPlayer = ChessType.Animi;
    else
      nowPlayer = ChessType.Self;

    this._move(row, col);

    return true;
  }

  draw(g) {
    this.drawSelect(g, this.row, this.col);
  }

  drawSelect(g, r, c) {
    if (this.img) {
      g.image(this.img, c * CELLSIZE, r * CELLSIZE, CELLSIZE, CELLSIZE);
    }
    else {
      this.tp == ChessType.Animi ? fill(255, 0, 0) : fill(0, 255, 0);
      textSize(CELLSIZE / 3);
      g.textAlign(CENTER, CENTER);
      g.text(this.tag, c * CELLSIZE, r * CELLSIZE, CELLSIZE, CELLSIZE);
    }
  }

  touched(x, y) {

  }
}

class Pawn extends Piece {
  constructor(x, y, tp) {
    if (tp == ChessType.Self) {
      super(x, y, tp, "P", loadImage("assets/wP.png"))
    }
    else {
      super(x, y, tp, "P", loadImage("assets/bP.png"))
    }

  }

  valid_(row, col) {
    if (this.tp == ChessType.Self) {
      if (this.row - row == 1 && this.col == col && !findPiece(row, col))
        return true;
      if (this.row - row == 2 && !this.moved && this.col == col && !findPiece(row, col))
        return true;
      if (Math.abs(this.col - col) == 1 && this.row - row == 1 && !!findPiece(row, col))
        return true;
    }
    else {
      if (this.row - row == -1  && this.col == col && !findPiece(row, col)) return true;
      if (this.row - row == -2 && !this.moved && this.col == col && !findPiece(row, col)) return true;
      if (Math.abs(this.col - col) == 1 && this.row - row == -1 && !!findPiece(row, col)) return true;
    }

    return false;
  }

  valid(row, col) {
    return super.valid(row, col) && this.valid_(row, col);
  }

  touchBased(){
    return (this.tp == ChessType.Self && this.row == 0) || (this.tp == ChessType.Animi && this.row == 7);
  }

  move(row, col) {
    if(super.move(row, col)){
      if(this.touchBased()){
        for (let i = 0; i < pieces.length; i++) {
          if (pieces[i].row == this.row && pieces[i].col == this.col) {
            pieces.splice(i, 1);
          }
        }
        let q = new Queen(this.tp);
        q._move(row, col);
        pieces.push(q);
      }
    }
  }
}

class King extends Piece {
  constructor(tp) {
    if (tp == ChessType.Self) {
      super(7, 4, tp, "K", loadImage("assets/wK.png"))
    } else {
      super(0, 4, tp, "K", loadImage("assets/bK.png"));
    }
  }

  move(row, col) {
    if (!super.move(row, col)) {
      //short casle
      let casled = false;
      let fn;
      if (this.row == 7 && col == 6 && !this.moved && !wrRook.moved && !findPiece(7, 5) && !findPiece(7, 6)) {
        fn = ()=> { wrRook._move(7, 5); };
        casled = true;
      }
      else if (this.row == 0 && col == 6 && !this.moved && !brRook.moved && !findPiece(0, 5) && !findPiece(0, 6)) {
        fn = () => { brRook._move(0, 5); };
        casled = true
      }
      else if (this.row == 7 && col == 2 && !this.moved && !wlRook.moved && !findPiece(7, 1) && !findPiece(7, 2) && !findPiece(7, 3)) {
        fn = () => { wlRook._move(7, 3); };
        casled = true;
      }
      else if (this.row == 0 && col == 2 && !this.moved && !blRook.moved && !findPiece(0, 1) && !findPiece(0, 2) && !findPiece(0, 3)) {
        fn = () => { blRook._move(0, 3); };
        casled = true;
      }
      if(!casled) return false;

      let r = this.row;
      let c = this.col;
      this.row = row;
      this.col = col;
      if (this.isMate()) {
        this.row = r;
        this.col = c;
        return false;
      }

      this.row = r;
      this.col = c;

      for (let i = 0; i < pieces.length; i++) {
        if (pieces[i].row == row && pieces[i].col == col) {
          pieces.splice(i, 1);
        }
      }
      this.row = row;
      this.col = col;

      fn();

      if (nowPlayer == ChessType.Self)
        nowPlayer = ChessType.Animi;
      else
        nowPlayer = ChessType.Self;

      this._move(row, col);

      return true;
    }
    return false;
  }

  valid_(row, col) {
    if (this.row == row && Math.abs(this.col - col) == 1) return true;
    if (this.col == col && Math.abs(this.row - row) == 1) return true;
    if (Math.abs(this.col - col) == 1 && Math.abs(this.row - row) == 1) return true;
    return false;
  }

  valid(row, col) {
    return super.valid(row, col) && this.valid_(row, col);
  }
}

class Bishop extends Piece {
  constructor(tp, leftOrRight = "left") {
    let col = 2;
    if (leftOrRight == "right") {
      col = 5;
    }
    if (tp == ChessType.Self) {
      super(7, col, tp, "B", loadImage("assets/wB.png"))
    } else {
      super(0, col, tp, "B", loadImage("assets/bB.png"));
    }
  }

  static valid_(This, row, col) {
    if (Math.abs(This.row - row) != Math.abs(This.col - col))
      return false;
    if (This.row == row && This.col == col)
      return false;
    let step_r = 1;
    let step_c = 1;
    if (row < This.row) {
      step_r = -1;
    }
    if (col < This.col) {
      step_c = -1;
    }

    let i = This.row + step_r;
    let j = This.col + step_c;

    while (true) {
      if (i == row && j == col)
        break;
      if (!!findPiece(i, j)) return false;
      i += step_r;
      j += step_c;
    }

    return true;
  }

  valid(row, col) {
    return super.valid(row, col) && Bishop.valid_(this, row, col);
  }
}

class Rook extends Piece {
  constructor(tp, leftOrRight = "left") {
    let col = 0;
    if (leftOrRight == "right") {
      col = 7;
    }
    if (tp == ChessType.Self) {
      super(7, col, tp, "R", loadImage("assets/wR.png"))
    } else {
      super(0, col, tp, "R", loadImage("assets/bR.png"));
    }
  }

  static valid_(This, row, col) {
    if (This.row != row && This.col != col)
      return false;
    if (This.row == row && This.col == col)
      return false;
    if (This.row == row) {
      let step_c = 1;
      if (col < This.col) step_c = -1;
      let c = This.col + step_c;
      while (true) {
        if (c == col) break;
        if (!!findPiece(row, c)) return false;
        c += step_c;
      }
      return true;
    }

    if (This.col == col) {
      let step_r = 1;
      if (row < This.row) step_r = -1;
      let r = This.row + step_r;
      while (true) {
        if (r == row) break;
        if (!!findPiece(r, col)) return false;
        r += step_r;
      }
      return true;
    }
    return false;
  }

  valid(row, col) {
    return super.valid(row, col) && Rook.valid_(this, row, col);
  }
}

class Queen extends Piece {
  constructor(tp) {
    if (tp == ChessType.Self) {
      super(7, 3, tp, "Q", loadImage("assets/wQ.png"))
    } else {
      super(0, 3, tp, "Q", loadImage("assets/bQ.png"));
    }
  }

  valid_(row, col) {
    return Rook.valid_(this, row, col) || Bishop.valid_(this, row, col);
  }

  valid(row, col) {
    return super.valid(row, col) && this.valid_(row, col);
  }

}

class Knight extends Piece {
  constructor(tp, leftOrRight = "left") {
    let col = 1;
    if (leftOrRight == "right") {
      col = 6;
    }
    if (tp == ChessType.Self) {
      super(7, col, tp, "N", loadImage("assets/wN.png"))
    } else {
      super(0, col, tp, "N", loadImage("assets/bN.png"));
    }
  }

  valid_(row, col) {
    if (Math.abs(this.row - row) == 2 && Math.abs(this.col - col) == 1)
      return true;
    if (Math.abs(this.row - row) == 1 && Math.abs(this.col - col) == 2)
      return true;
    return false;
  }

  valid(row, col) {
    return super.valid(row, col) && this.valid_(row, col);
  }
}

class ChessCell {
  constructor(x, y, w) {
    this.row = x;
    this.col = y;
    this.size = w;
    this.bound = { left: y * w, top: x * w, w: w, h: w };
  }

  color(reverse = 0) {
    if (((this.row + 1) % 2 == 1 && (this.col + 1) % 2 == 1) || ((this.row + 1) % 2 == 0 && (this.col + 1) % 2 == 0)) {
      return CHESS_COLOR[(1 + reverse) % 2];
    } else {
      return CHESS_COLOR[(0 + reverse) % 2];
    }
  }

  draw(g) {
    //console.log(this.color());
    fill(this.color());
    g.rect(this.bound.left, this.bound.top, this.size, this.size);
  }
}

class ChessBoard {
  constructor(left, top) {
    this.left = left;
    this.top = top;
    this.cells = [];
    for (let i = 0; i < 8; i++) {
      this.cells.push([]);
      for (let j = 0; j < 8; j++) {
        this.cells[i].push(new ChessCell(i, j, CELLSIZE));
        //console.log(this.cells[i][j]);
      }
    }
  }

  draw_left(g) {
    //g.textFont(inconsolata);
    g.fill(0);
    textSize(CELLSIZE / 3);
    g.textAlign(RIGHT, CENTER);
    for (let i = 0; i < 8; i++) {
      g.text(8 - i, -CELLSIZE, CELLSIZE * i, CELLSIZE, CELLSIZE);
    }


  }

  draw_bottom(g) {
    g.fill(0);
    textSize(CELLSIZE / 3);
    g.textAlign(CENTER);
    for (let i = 0; i < 8; i++) {
      g.text(String.fromCharCode(i + 65), CELLSIZE * i, CELLSIZE * 8, CELLSIZE - 20, CELLSIZE - 20);
    }
  }

  draw_player(g) {
    if (nowPlayer == ChessType.Animi) {
      g.fill(0);
      g.circle(CELLSIZE * 8 + CELLSIZE / 2, CELLSIZE / 2, 30);
    }
    else {
      g.stroke(0);
      g.fill(255);
      g.circle(CELLSIZE * 8 + CELLSIZE / 2, CELLSIZE * 7 + CELLSIZE / 2, 30);

    }
  }

  draw(g) {
    //g.push();
    g.translate(this.left, this.top);

    this.draw_left(g);

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        this.cells[r][c].draw(g);
      }
    }

    this.draw_bottom(g);
    this.draw_player(g);
    //g.pop();
  }

  convert(x, y) {
    let r = Math.floor((y - this.top) / CELLSIZE);
    let c = Math.floor((x - this.left) / CELLSIZE);
    return [r, c];
  }
}


function preload() {
  CHESS_COLOR = [color(118, 150, 86), color(238, 238, 210)]

  chess = new ChessBoard(CELLSIZE, CELLSIZE);

  wKing = new King(ChessType.Self);
  bKing = new King(ChessType.Animi);

  pieces.push(wKing);
  pieces.push(bKing);

  pieces.push(new Queen(ChessType.Animi));
  pieces.push(new Queen(ChessType.Self));

  pieces.push(new Bishop(ChessType.Animi, "left"));
  pieces.push(new Bishop(ChessType.Self, "left"));
  pieces.push(new Bishop(ChessType.Animi, "right"));
  pieces.push(new Bishop(ChessType.Self, "right"));

  pieces.push(new Knight(ChessType.Animi, "left"));
  pieces.push(new Knight(ChessType.Self, "left"));
  pieces.push(new Knight(ChessType.Animi, "right"));
  pieces.push(new Knight(ChessType.Self, "right"));

  for (let i = 0; i < 8; i++) {
    pieces.push(new Pawn(6, i, ChessType.Self));
  }
  for (let i = 0; i < 8; i++) {
    pieces.push(new Pawn(1, i, ChessType.Animi));
  }
  
  blRook = new Rook(ChessType.Animi, "left");
  pieces.push(blRook);
  wlRook = new Rook(ChessType.Self, "left");
  pieces.push(wlRook);
  brRook = new Rook(ChessType.Animi, "right");
  pieces.push(brRook);
  wrRook = new Rook(ChessType.Self, "right");
  pieces.push(wrRook);
}

function setup() {
  createCanvas(800, 800);
  //noLoop();
}

function draw() {
  background(220);
  push();
  chess.draw(this);
  pieces.forEach(e => {
     e.draw(this);
  });
  pop();

}

function mousePressed() {
  if (!chess) return false;
  if (!currPiece) {
    let [r, c] = chess.convert(mouseX, mouseY);
    currPiece = findPiece(r, c);
    return false;
  }

  let [r, c] = chess.convert(mouseX, mouseY);

  currPiece.move(r, c);
  currPiece = undefined;
  cursor(ARROW);
  return false;
}


function mouseMoved() {
  if (mouseIsPressed) return false;
  if (!chess) return false;
  if (currPiece) {
    //console.log(currPiece);
    return false;
  }

  let [r, c] = chess.convert(mouseX, mouseY);
  let t = findPiece(r, c);
  if (t) {
    cursor('grab');
  } else {
    cursor(HAND);
  }

  return false;
}

function mouseDragged() {
  if (!chess) return false;
  if (!currPiece) {
    let [r, c] = chess.convert(mouseX, mouseY);
    currPiece = findPiece(r, c);
  }
  if (currPiece) {
    cursor('grap');
  }
  else {
    cursor(HAND);
  }
  return false;
}

function mouseReleased() {
  if (!currPiece) return false;
  let [r, c] = chess.convert(mouseX, mouseY);
  if (r == currPiece.row && c == currPiece.col) return false;

  currPiece.move(r, c);
  currPiece = undefined;
  //console.log("mouseReleased:", currPiece);
  cursor(ARROW);
  return false;
}
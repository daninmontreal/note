let w = 1000;
let h = 800;
let cols = 0;
let rows = 0;
let scl = 20;
let zs = [];

let flying = 0;
function setup() {
    //w = width;
    //h = height;
    createCanvas(w, h, WEBGL);
    cols = Math.floor(w / scl) + 10;
    rows = Math.floor(h / scl) + 10;

    zs = new Array(rows);
    for (let y = 0; y < rows; y++) {
        zs[y] = new Array(cols);
    }
}

function draw() {
    let yoff = flying;
    for (let y = 0; y < rows; y++) {
        let xoff = 0;
        for (let x = 0; x < cols; x++) {
            zs[y][x] = map(noise(xoff, yoff), 0, 1, -100, 100);
            xoff += 0.2
        }
        yoff += 0.2;
    }
    flying -= 0.01;

    background(0);
    noFill();
    stroke(255, 204, 0, 255);

    rotateX(PI / 3);

    translate(-w / 2, -h / 2);
    for (let y = 0; y < rows - 1; y++) {
        beginShape(TRIANGLE_STRIP  );
        for (let x = 0; x < cols; x++) {
            vertex(x * scl, y * scl, zs[y][x]);
            vertex(x * scl, y * scl + scl, zs[y + 1][x]);
        }
        endShape();
    }
}
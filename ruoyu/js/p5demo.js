$(() => {

    let sketch = function (p) {
        let rad = 60; // Width of the shape
        let xpos, ypos; // Starting position of shape

        let xspeed = 2.8; // Speed of the shape
        let yspeed = 2.2; // Speed of the shape

        let xdirection = 1; // Left or Right
        let ydirection = 1; // Top to Bottom

        p.setup = function () {
            let div = $('#p5container');
            p.createCanvas(div.width(), div.height());
            p.noStroke();
            p.frameRate(30);
            p.ellipseMode(RADIUS);
            // Set the starting position of the shape
            xpos = p.width / 2;
            ypos = p.height / 2;

        }

        p.draw = () => {
            p.background(102);

            // Update the position of the shape
            xpos = xpos + xspeed * xdirection;
            ypos = ypos + yspeed * ydirection;

            // Test to see if the shape exceeds the boundaries of the screen
            // If it does, reverse its direction by multiplying by -1
            if (xpos > p.width - rad || xpos < rad) {
                xdirection *= -1;
            }
            if (ypos > p.height - rad || ypos < rad) {
                ydirection *= -1;
            }

            // Draw the shape
            p.ellipse(xpos, ypos, rad, rad);
        }
    };
    new p5(sketch, 'p5container');

});
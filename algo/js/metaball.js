
class MetaBall {
    constructor(p, x, y, r = 40) {
        this.r = r;
        this.pos = new p.createVector(x, y);
        this.graphic = p;
        this.vec = p5.Vector.random2D();
        this.vec.mult(p.random(2, 5));
    }

    show(opt=false) {
        this.pos.add(this.vec);
        if (this.pos.x < 0 || this.pos.x >= this.graphic.width) {
            this.vec.x *= -1;
        }
        if (this.pos.y < 0 || this.pos.y >= this.graphic.height) {
            this.vec.y *= -1;
        }
        
        if(opt){
            this.graphic.noFill();
            this.graphic.strokeWeight(4);
            this.graphic.stroke(0);
            this.graphic.ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
        }
    }
}

$(() => {
    let sketch = (p) => {
        let balls = [];
        const N = 5;
        const R = 20;
        const FACTOR = 300;
        const W = 300;

        p.setup = () => {
            let div = $('#metaball');
            div.height(W);
            div.width(W);
            p.createCanvas(div.width(), div.height());
            //p.frameRate(20);
            for (let i = 0; i < N; i++) {
                balls.push(new MetaBall(p, p.random(p.width), p.random(p.height), R));
            }
            //p.colorMode(p.HSB, 100);
        };

        p.draw = () => {
            p.background(0)
            //
            p.loadPixels();
            //console.log(p.pixels.length/(W*W));
            if (true) {
                let idx = 0;
                for (let y = 0; y < p.height; y++) 
                    for (let x = 0; x < p.width; x++) 
                    {
                        let d = 0;
                        balls.forEach(e => {
                            let s = p.dist(x, y, e.pos.x, e.pos.y);
                            d += FACTOR*e.r/s;
                        });
                        p.pixels[idx] = d;
                        p.pixels[idx + 1] = d;
                        p.pixels[idx + 2] = d;
                        p.pixels[idx + 3] = 255;
                        idx += 4;
                    }
            }
            p.updatePixels();

            balls.forEach((b) => {
                b.show();
            })
        };
    };
    new p5(sketch, 'metaball');
});
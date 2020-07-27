
class Patrice {
    constructor(g, x, y, hu, fired = false) {
        this.g = g;
        this.pos = g.createVector(x, y);
        this.fired = fired;
        this.lifespan = 400;
        this.hu = hu;
        if (!fired) {
            this.vel = g.createVector(0, -10);
        }
        else {
            this.vel = p5.Vector.random2D();
            this.vel.mult(this.g.random(2, 10));
        }
        this.acc = this.g.createVector(0, 0);
    }

    apllyForce(force) {
        this.acc.add(force);
    }

    done(){
        return this.lifespan < 0;
    }

    update() {
        if (this.fired) {
            this.vel.mult(0.85);
            this.lifespan -= 4;
        }
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    show() {
        if (this.fired) {
            this.g.stroke(this.hu, 255, 255, this.lifespan);
            this.g.strokeWeight(2);
        }
        else {
            this.g.strokeWeight(4);
            this.g.stroke(this.hu, 255, 255, 255);
        }
        this.g.point(this.pos.x, this.pos.y);
    }
}

class FireWork {
    constructor(g) {
        this.hu = g.random(255);
        this.firework = new Patrice(g, g.random(g.width), g.random(g.height), this.hu);
        this.exploded = false;
        this.children = [];
        this.g = g;
    }

    update() {
        if (!this.exploded) {
            this.firework.apllyForce(gravity);
            this.firework.update();

            if (this.firework.vel.y >= 0) {
                this.exploded = true;
                this.explode();
            }
        }

        for(let i = this.children.length-1; i >= 0; i--)
        {
            let p = this.children[i];
            p.apllyForce(gravity);
            p.update(); 
            if(p.done()){
                this.children.splice(i, 1);
            }
        }
    }

    explode() {
        for (let i = 0; i < 100; i++) {
            this.children.push(new Patrice(this.g, this.firework.pos.x, this.firework.pos.y, this.hu, true));
        }
    }

    done() {
        return this.exploded && this.children.length == 0;
    }

    show() {
        this.g.colorMode(this.g.HSB);
        if (!this.exploded) {
            this.firework.show();
        }
        else {
            this.children.forEach((p) => {
                //p.update();
                p.show();
            });
        }
    }
}

let fireworks = [];
var gravity;

$(() => {
    let sketch = function (p) {
        p.setup = function () {
            let div = $('#p5main');
            div.on("mousedown", (event)=>{
                event.preventDefault();
                fireworks = [];                
            });
            if(div.width() > 300 && div.height() > 300){
                p.createCanvas(div.width(), div.height());
            }
            else{
                p.createCanvas(1024, 768);
            }
            
            p.stroke(255);
            p.strokeWeight(4);
            gravity = p.createVector(0, 0.2);
        }

        p.draw = () => {
            p.colorMode(p.RGB);
            p.background(0, 51);
            if (fireworks.length <= 100) {
                fireworks.push(new FireWork(p));
            }
        
            for(let i = fireworks.length-1; i >= 0; i--)
            {
                let fw = fireworks[i];
                fw.update();
                fw.show();
                if(fw.done()){
                    //fireworks.splice(i, 1);
                }
            }; 
        }
    };
    new p5(sketch, 'p5main');

});
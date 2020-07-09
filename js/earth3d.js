class Object3D{
    constructor(lat, lon) {
        this.lat = lat;
        this.lon = lon;
    }

    world2Client(g, r){
        let theta = g.radians(this.lat) + g.PI/2;
        let phi   = g.radians(this.lon) + g.PI;
        return {
            x: r * g.sin(theta) * g.cos(phi),
            y: -r * g.sin(theta) * g.sin(phi),
            z: r * g.cos(theta)
        }     
    }

    draw(g, r){
        g.push();
        let pos = this.world2Client(g, r);
        g.translate(pos.x, pos.y, pos.z);
        g.box(40);
        g.pop();
    }
}

$(() => {
    let sketch = function (p) {
        var angle = 45;
        var objs = [];
        const R = 200;
        var img;
        p.preload = function() {
            img = p.loadImage("img/world.jpg");
        }

        p.setup = function () {
            let div = $('#p5earth');
            if(div.width() > 300 && div.height() > 300){
                p.createCanvas(div.width(), div.height(), p.WEBGL);
            }
            else{
                p.createCanvas(1024, 768, p.WEBGL);
            }

            p.createEasyCam();
            
            p.stroke(255);
            p.strokeWeight(4);

            //objs.push(new Object3D(0,0));
            //objs.push(new Object3D(0,90));
        }

        p.draw = () => {
            p.background(100);
            p.rotateY(angle);
            //angle += 0.03;

            p.lights();
            p.fill(200);
            p.noStroke();

            p.texture(img);
            p.sphere(R);

            objs.forEach((o)=>{
                o.draw(p, R);
            });
            //p.popMatrix();
        }
    };
    new p5(sketch, 'p5earth');

});

const MAX_LEVEL = 10;

class GeoPoint {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

class Bound {
    constructor(left, top, w, h){
        this.left = left;
        this.top = top;
        this.w = w;
        this.h = h;
    }

    contains(x, y){
        return x >= this.left && x <= (this.left+this.w) && y >= this.top && y <= (this.top + this.h); 
    }
}

class QuadTree {
    constructor(capacity, bound, level=0){
        this.bound = bound;
        this.level = level;
        this.capacity = capacity;    
        this.dataSet = [];
        this.northeast = null;
        this.northwest = null;
        this.southeast = null;
        this.southwest = null;
        
        this.neBound = new Bound(bound.left + bound.w/2, bound.top,             bound.w/2, bound.h/2);
        this.nwBound = new Bound(bound.left,             bound.top,             bound.w/2, bound.h/2);
        this.seBound = new Bound(bound.left + bound.w/2, bound.top + bound.h/2, bound.w/2, bound.h/2);
        this.swBound = new Bound(bound.left,             bound.top + bound.h/2, bound.w/2, bound.h/2);
    }

    add(x, y) {
       if(this.dataSet.length < this.capacity || this.level == MAX_LEVEL){
           this.dataSet.push(new GeoPoint(x, y));
           //console.log(`add new point (${x}, ${y})`);
           return; 
       } 

       this.bound.contains(x, y) && (this.addNE(x, y) || this.addNW(x, y) || this.addSE(x, y) || this.addSW(x, y));
    }

    divide(){
        if(!this.northeast) this.northeast = new QuadTree(this.capacity, this.neBound, this.level+1);
        if(!this.northwest) this.northwest = new QuadTree(this.capacity, this.nwBound, this.level+1);
        if(!this.southeast) this.southeast = new QuadTree(this.capacity, this.seBound, this.level+1);
        if(!this.southwest) this.southwest = new QuadTree(this.capacity, this.swBound, this.level+1);
    }

    addNE(x, y) {
        if(this.neBound.contains(x, y)){
            this.divide();
            this.northeast.add(x, y);
            return true;
        }
        return false;
    }


    addNW(x, y){
        if(this.nwBound.contains(x, y)){
            this.divide();
            this.northwest.add(x, y);
            return true;
        }
        return false;
    }

    addSE(x, y){
        if(this.seBound.contains(x, y)){
            this.divide();
            this.southeast.add(x, y);
            return true;
        }
        return false;
    }

    addSW(x, y){
        if(this.swBound.contains(x, y)){
            this.divide();
            this.southwest.add(x, y);
            return true;
        }
        return false;
    }

    draw(g){
        g.stroke(0);
        g.noFill();
        g.strokeWeight(1);
        g.rect(this.bound.left, this.bound.top, this.bound.w, this.bound.h);

        this.dataSet.forEach((pt)=>{
            g.strokeWeight(4);
            g.point(pt.x, pt.y);
        });

        this.northeast && this.northeast.draw(g);
        this.northwest && this.northwest.draw(g); 
        this.southeast && this.southeast.draw(g);
        this.southwest && this.southwest.draw(g);
    }
}

$(()=>{
    let sketch = function (p) {
        let qt = undefined;
        p.preload = function() {
        }

        let initilize = (p)=>{
            let div = $('#quadtree'); 
            qt = new QuadTree(4, new Bound(0, 0, div.width(), div.height()));
            for(let i = 0; i < 100; i++){
                qt.add(p.random(div.width()), p.random(div.height()));
            }
        }

        p.setup = function () {
            let div = $('#quadtree');
            div.width(666);
            div.height(666);
            p.createCanvas(div.width(), div.height());
            p.frameRate(4);

            initilize(p);
        }

        p.draw = () => {
            if(p.mouseIsPressed){
                qt.add(p.mouseX, p.mouseY);
            }
            p.background(255);
            qt.draw(p);
        }
    };
    new p5(sketch, 'quadtree');
});
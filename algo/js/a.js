
var rows = 10;
var cols = 10;
var done = false;
var solution = undefined;

function make2DArray(rows, cols){
    let grid = new Array(cols);
    for(let i = 0; i < cols; i++){
        grid[i] = new Array(rows);
    }

    return grid;
}

class Spot{
    constructor(i, j, graph){
        this.i = i;
        this.j = j;
        this.g = 0;
        this.h = 0;
        this.f = 0;
        this.graph = graph;
        this.prev = undefined;
        this.wall = false;
    }

    show(g, w, h, color){
        g.push();
        g.fill(color);
        if(this.wall){
            g.fill(0);
        }
        g.noStroke();
        g.rect(this.i*w+1, this.j*h+1, w-2, h-2);
        g.pop();
    }

    randomWall(g){
        if(g.random(1) < 0.2){
            this.wall = true;
        }
    }

    neighbors() {
        let i = this.i;
        let j = this.j;
        let nb = [];

        if(i < cols-1){
            let n = this.graph[i+1][j];
            if(!n.wall)
                nb.push(n); 
        }
        if(i>0){
            let n = this.graph[i-1][j];
            if(!n.wall)
                nb.push(n);  
        }
        if(j<rows-1){
            let n = this.graph[i][j+1];
            if(!n.wall)
                nb.push(n);  
        }
        if(j>0){
            let n = this.graph[i][j-1];
            if(!n.wall)
                nb.push(n);  
        }

        if(j<rows-1 && i<cols-1){
            let n = this.graph[i+1][j+1];
            if(!n.wall)
                nb.push(n);  
        }

        if(j>0&& i>0){
            let n = this.graph[i-1][j-1];
            if(!n.wall)
                nb.push(n);  
        }

        return nb;
    }
}

$(()=>{
    let sketch = function(p){
        var grid = make2DArray(rows, cols);
        
        var openSet = [];
        var closedSet = [];
        var start;
        var end;

        var w;
        var h;

        function initialize(){
            for(let i = 0; i < cols; i++){
                for(let j = 0; j < rows; j++) {
                    grid[i][j] = new Spot(i, j, grid);
                    grid[i][j].randomWall(p);
                }
            }

            start = grid[0][0];
            end = grid[cols-1][rows-1];
            start.wall = false;
            end.wall = false;
            openSet.push(start);
        }

        function heuristic(start, end){
            //return p.dist(start.i, start.j, end.i, end.j);
            return p.abs(start.i-end.i) + p.abs(start.j-end.j);
        }

        function stepOne(){
            if(openSet.length > 0){
                let winner = 0;
                for(let i = 1; i < openSet.length; i++){
                    if(openSet[i].f < openSet[winner].f){
                        winner = i;
                    }
                }
                let current = openSet[winner];
                if(current === end){
                    //DONE
                    done = true;
                    console.log("Done");
                    return current;
                }
                
                openSet.splice(winner, 1);
                closedSet.push(current);

                let nbs = current.neighbors();
                for(let i = 0; i < nbs.length; i++){
                    let neighbor = nbs[i];
                    if(!closedSet.includes(neighbor)){
                        var tmpG = current.g + 1;
                        if(openSet.includes(neighbor)){
                            if(tmpG < neighbor.g){
                                neighbor.g = tmpG;
                            }
                        }
                        else{
                            neighbor.g = tmpG;
                            openSet.push(neighbor);
                        }
                        neighbor.h = heuristic(neighbor, end);
                        neighbor.f = neighbor.h + neighbor.g;
                        neighbor.prev = current;
                    }
                }

            }else{
                done = true;
                console.log("no solutions");
            }

            return undefined;
        }

        p.setup = ()=>{
            let div = $('#shortp');
            div.width(600);
            div.height(600);
            p.createCanvas(div.width(), div.height());

            initialize(); 

            w = Math.floor(p.width/cols);
            h = Math.floor(p.height/rows); 

        }

        p.draw = () => {
            p.background(0);
            

            for(let i = 0; i < cols; i++){
                for(let j = 0; j < rows; j++) {
                    grid[i][j].show(p, w, h, p.color(255));
                }
            }

            if(!done){
                solution = stepOne();

                closedSet.forEach((m)=>{
                    //m.show(p, w, h, p.color(255,0,0));
                });
                //console.log(closedSet);

                openSet.forEach((m)=>{
                    m.show(p, w, h, p.color(0,0,255));
                    //console.log("Current");
                });

            }
            

            let path = solution;
            while(path){
                path.show(p, w, h, p.color(0,255,0));
                path = path.prev;
            }
            
        }
    }

    new p5(sketch, 'shortp');
});
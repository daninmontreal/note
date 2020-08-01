
const LEN = 130;

function drawFracalTree(gctx, len, angle){
   
   if(len <= 4) return;
   gctx.line(0, 0, 0, -len);
   
   gctx.translate(0, -len);

   gctx.push();
   gctx.rotate(angle);
   drawFracalTree(gctx, len*0.67, angle);
   gctx.pop();

   gctx.push();
   gctx.rotate(-angle);
   drawFracalTree(gctx, len*0.67, angle);
   gctx.pop();
}

$(()=>{
    let sketch = function (p) {
        var slider;
        p.preload = function() {
        }


        p.setup = function () {
            let div = $('#fractaltree');
            div.width(420);
            div.height(420);
            p.createCanvas(div.width(), div.height()-30);
            //p.noLoop();
            slider = p.createSlider(0, p.TWO_PI, p.PI/4); 
        }

        p.draw = () => {
            p.background(255);
            p.stroke(66);
            p.fill(100);
            p.translate(p.width/2, p.height);
            drawFracalTree(p, LEN, slider.value());
        }
    };
    new p5(sketch, 'fractaltree');
});

async function sleep(ms){
    return new Promise(resolve=>setTimeout(resolve, ms));
}

async function swap(nums, i , j){
    await sleep(50);
    let tmp = nums[i];
    nums[i] = nums[j];
    nums[j] = tmp;
}

var pivotIndex = 0; 

async function partition(nums, start, end) {
    pivotIndex = Math.floor((end + start) / 2);
    let pivot = nums[pivotIndex], //middle element
        i = start, //left pointer
        j =  end; //right pointer
    while (i <= j) {
        while (nums[i] < pivot) {
            i++;
        }
        while (nums[j] > pivot) {
            j--;
        }
        if (i <= j) {
            await swap(nums, i, j); //sawpping two elements
            i++;
            j--;
        }
    }
    return i;
}

async function qsort(nums, start, end){
    if(start >= end) 
        return;

    let mid = await partition(nums, start, end);
    await Promise.all([qsort(nums, start, mid - 1), qsort(nums, mid, end)]);
}


$(()=>{
    let nums = [];
    const w = 10;
    let sketch = function (p) {
        p.preload = function() {
        }

        let initilize = (p)=>{
            let div = $('#qsort');
            
            nums = [];
            const sz = Math.floor(p.width/w);
            for(let i = 0; i < sz;  i++){
                nums.push(p.random(1, p.height));
            }

            qsort(nums, 0, nums.length - 1);
        }

        p.setup = function () {
            
            let div = $('#qsort');
            div.height(400);
            p.createCanvas(div.parent().width(), div.height());
            p.frameRate(4);

            initilize(p);
        }

        p.draw = () => {
            p.background(255);
            let x = 0;
            p.stroke(66);
            p.fill(100);
            p.strokeWeight(1);
            nums.forEach((n)=>{
                p.rect(x, p.height-n, w, n);
                x += w;
            });

            p.stroke(255, 0, 0);
            p.rect(w*pivotIndex, p.height-nums[pivotIndex], w, nums[pivotIndex]);
        }

        p.windowResized = ()=>{
            let div = $('#qsort');
            p.resizeCanvas(div.parent().width(), div.height());
            initilize(p);
          }
    };
    new p5(sketch, 'qsort');
});
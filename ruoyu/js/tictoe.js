
let tics = [0,0,0,0,0,0,0,0,0]
let current = "X";

function changed(){
    if(current == "X"){
      current = "O";
    }else{
        current = "X";
    }
}

function onCellClick(cell, index){
    console.log(cell);
    tics[index] = current;
    document.getElementById(cell).innerHTML = current;
    changed();
}
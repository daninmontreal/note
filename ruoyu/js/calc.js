
let expr = "";

function onClick(num) {
  expr += `${num}`;
  update();
}

function onClear(){
  expr = "";
  update();
}

function onCompute(opt){
  expr += opt;
  update();
}

function update(){
    let result = document.getElementById("result");
    result.value = expr;
}

function calculate()
{
    document.getElementById("result").value = eval(expr);
}
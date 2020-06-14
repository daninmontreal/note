function startTimer() {
  let divOfCanvas = document.getElementById("clock");
  let canvas = document.getElementById("canvas");
  let clockContext = canvas.getContext("2d");
  
  canvas.width = divOfCanvas.offsetWidth;
  canvas.height = divOfCanvas.offsetHeight;
  
  let clockRadius = canvas.height / 2;
  clockContext.translate(clockRadius, clockRadius);
  clockRadius = clockRadius * 0.90
  setInterval(()=>{
    drawFace(clockContext, clockRadius);
    drawNumbers(clockContext, clockRadius);
    drawTime(clockContext, clockRadius);        
  }, 1000);
}

function drawFace(clockContext, radius) {
  let grad;
  clockContext.beginPath();
  clockContext.arc(0, 0, radius, 0, 2*Math.PI);
  clockContext.fillStyle = 'white';
  clockContext.fill();
  grad = clockContext.createRadialGradient(0,0,radius*0.95, 0,0,radius*1.05);
  grad.addColorStop(0, '#333');
  grad.addColorStop(0.5, 'white');
  grad.addColorStop(1, '#333');
  clockContext.strokeStyle = grad;
  clockContext.lineWidth = radius*0.1;
  clockContext.stroke();
  clockContext.beginPath();
  clockContext.arc(0, 0, radius*0.1, 0, 2*Math.PI);
  clockContext.fillStyle = '#333';
  clockContext.fill();
}

function drawNumbers(clockContext, radius) {
  let ang;
  let num;
  clockContext.font = radius*0.15 + "px arial";
  clockContext.textBaseline="middle";
  clockContext.textAlign="center";
  for(num = 1; num < 13; num++){
    ang = num * Math.PI / 6;
    clockContext.rotate(ang);
    clockContext.translate(0, -radius*0.85);
    clockContext.rotate(-ang);
    clockContext.fillText(num.toString(), 0, 0);
    clockContext.rotate(ang);
    clockContext.translate(0, radius*0.85);
    clockContext.rotate(-ang);
  }
}

function drawTime(clockContext, radius){
    let now = new Date();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();
    //hour
    hour=hour%12;
    hour=(hour*Math.PI/6)+
    (minute*Math.PI/(6*60))+
    (second*Math.PI/(360*60));
    drawHand(clockContext, hour, radius*0.5, radius*0.07);
    //minute
    minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
    drawHand(clockContext, minute, radius*0.8, radius*0.07);
    // second
    second=(second*Math.PI/30);
    drawHand(clockContext, second, radius*0.9, radius*0.02);
}

function drawHand(clockContext, pos, length, width) {
    clockContext.beginPath();
    clockContext.lineWidth = width;
    clockContext.lineCap = "round";
    clockContext.moveTo(0,0);
    clockContext.rotate(pos);
    clockContext.lineTo(0, -length);
    clockContext.stroke();
    clockContext.rotate(-pos);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
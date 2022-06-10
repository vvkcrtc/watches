
import React, { useEffect, useState, useRef } from 'react'


function AnalogClock(props) {

  const [date, setDate] = useState(calcTime(props.tz));
 
  const canvasRef = useRef(null);

  function updateClock() {
    setDate(calcTime(props.tz));
    drawClock(new Date(calcTime(props.tz)));
  }  

  function calcTime(offset) {
    var d = new Date();
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    var nd = new Date(utc + (3600000*offset));
    return nd;
  }

  useEffect(() => {
    const timerId = setInterval(updateClock, 1000);
    setDate(calcTime(props.tz));
    drawClock(new Date(calcTime(props.tz)));
    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);  


  const drawClock = (t) => {
        
    var clockArms = [t.getHours(), t.getMinutes(), t.getSeconds()];
        
    var canvas=canvasRef.current;
    var width = canvas.width;
    var height = canvas.height;
    var ctx = canvas.getContext('2d');
    //очистить канву:
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    //нарисовать контур часов:
    var x = Math.round(width/2);
    var y = Math.round(height/2);
    var r = Math.round(Math.min(x,y)-2);
    ctx.beginPath(); 
    ctx.arc(x,y,r,0,2*Math.PI,true);
    console.log("x: ",x,"y: ",y,"r: ",r,"c.width: ",width,"c.height: ",height," date : ",date);
    //нарисовать градиент на циферблате:
    var grd=ctx.createRadialGradient(x,y,0,x,y,r);
    grd.addColorStop(0,'#EEDDEE');
    grd.addColorStop(0.5,'#CCEECC');
    grd.addColorStop(1,'#99FF99');
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#C0C0C0';
    ctx.stroke();
    ctx.closePath();
    //нарисовать метки циферблата и цифры:
    ctx.save();
    ctx.textBaseline = "middle";
    ctx.textAlign = 'center';
    ctx.shadowColor = '#800000';
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.shadowBlur = 6;
    var delta = Math.max(8,Math.round(r/10)); //для размера шрифта и отсечек
    ctx.font = 'bold '+delta+'pt sans-serif';
    var u=Math.PI/2;
    var hour = 1;
    for (var i=2; i<62; i++) {
      ctx.beginPath();
      var r1=r-delta;
      if (i%5 !== 2) { 
        r1+=delta/2;
      }
      var x1 = x+Math.round(r1*Math.cos(u)); //так можно узнать позиции делений циферблата
      var y1 = y-Math.round(r1*Math.sin(u));
      var x2 = x+Math.round(r*Math.cos(u));
      var y2 = y-Math.round(r*Math.sin(u));
      ctx.strokeStyle = '#606060';
      ctx.moveTo(x1,y1);
      ctx.lineTo(x2,y2); //Вывести деление
      u+=Math.PI/30;
      ctx.stroke();
      ctx.closePath();
      if ( i%5 === 2) {
        ctx.fillStyle = '#202020';
        ctx.fillText (''+(13-hour),x1,y1); //а так вывести цифры по часовому кругу
        hour++;
        ctx.fill();
      }
    }  

    ctx.restore();
    //нарисовать стрелки:
    clockArms[1] += clockArms[2] / 60;
    clockArms[0] += clockArms[1] / 60;
    drawClockArm(ctx, x, y, clockArms[0] * 30, 2*r/2.5 - 15, 5, '#000080');
    drawClockArm(ctx, x, y, clockArms[1] * 6,  2*r/2.2 - 10, 3, '#008000');
    drawClockArm(ctx, x, y, clockArms[2] * 6,  2*r/2.0 - 6,  2, '#800000');
  }
 
  function drawClockArm(ctx, x,y, degrees, len, lineWidth, style) {
    ctx.save();
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.translate(x, y);
    ctx.rotate((degrees - 90) * Math.PI / 180);
    ctx.strokeStyle = style;
    ctx.beginPath();
    ctx.moveTo(-len / 10, 0);
    ctx.lineTo(len, 0);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }

  
  return (
    <div align="center">
      <canvas id={props.id} ref={canvasRef} width={props.width} height={props.height}/>  
      <br />
      <p className="OutText">{date.toLocaleTimeString()}</p>
    </div>
  );
}

export default AnalogClock;
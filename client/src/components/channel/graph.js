/* 
    Total views graph
    c - canvas element
    data - graph data
*/
export function graph(c, data) {
    // X value offset from left
    const xoffset = 100;

    // Finding max value for Y axis (minimum 50)
    var max = Math.ceil(Math.max(...data)/50)*50;
    max = (max === 0) ? 50 : max;
    var ctx = c.getContext("2d");
    const zeroPad = (num) => String(num).padStart(2, '0');
    
    // Drawing graph's background lines
    ctx.beginPath();
    ctx.strokeStyle = "#d3d3d3";
    ctx.lineWidth = 0.5;
    ctx.strokeRect(xoffset/2, 1, 570, 200);
    ctx.moveTo(xoffset/2,40);
    for(let i = 1; i < 5; i++) {
        ctx.lineTo(620,i*40);
        ctx.moveTo(xoffset/2,(i+1)*40);
    }
    ctx.stroke();
    
    // Y axis values (views)
    ctx.beginPath();
    ctx.font = "11px Calibri";
    ctx.fillStyle = "#8a8a8a";
    for(let i = 0; i < 5; i++) {
        let off = (i==0) ? 0 : 5;
        let yval = max/5*(5-i);
        ctx.fillText(yval, xoffset/2 - ctx.measureText(yval).width - 5,10 + 40*i - off);
    }
    ctx.fillText("0",xoffset/2 - 10,200);
    
    // X axis values (dates)
    let date = new Date();
    date.setMonth(date.getMonth() - 5);
    for(let i = 0; i < 6; i++) {
        const xval = zeroPad(date.getMonth()+1)+"/"+date.getFullYear();
        ctx.fillText(xval,xoffset*(i+1)-ctx.measureText(xval).width/2,215);
        date.setMonth(date.getMonth() + 1);
    }
    ctx.stroke();

    // Graph's line design
    var linegrad = ctx.createLinearGradient(xoffset, Y(data[0], max), 500+xoffset,200);
    linegrad.addColorStop(0, "#b2d143");
    linegrad.addColorStop(0.5, "#80bd7e");
    linegrad.addColorStop(1, "#53baaf");
    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 2;
    ctx.strokeStyle = linegrad;

    // Starting dot
    let dots = [{x: xoffset, y: Y(data[0], max)}];
    ctx.moveTo(dots[0].x, dots[0].y);

    // Placing dots on the graph
    for(let i = 1; i < data.length; i++) {
        dots[i] = {x: i*xoffset+xoffset, y: Y(data[i], max)}
        ctx.lineTo(dots[i].x, dots[i].y);
    }
    ctx.stroke();

    // Closing path 
    ctx.lineTo(500+xoffset,200);
    ctx.lineTo(xoffset,200);
    ctx.closePath();
    
    
    // gradient shadow
    var y1 = 0, y2 = 220;
    var fillgrad = ctx.createLinearGradient(0, y1, 0, y2);  
    fillgrad.addColorStop(0, "#c9f1e9d9");
    fillgrad.addColorStop(1, "#ffffff52");
    ctx.fillStyle = fillgrad;
    ctx.fill();

    return dots;
}
    
// Calculating Y value of dot
function Y(val, max) {
    return 200-(val/max)*200;
}
    
    
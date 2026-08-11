/* Statistical Hub - All-in-One Data Visualization */
(function(){
"use strict";
const $=id=>document.getElementById(id);
let charts=[];

function parseNums(text){
  return String(text||"").replace(/[;]/g,",").split(/[\s,]+/).map(Number).filter(Number.isFinite);
}
function fmt(x){
  if(!Number.isFinite(x)) return "—";
  return Math.abs(x)>=1000 ? x.toLocaleString(undefined,{maximumFractionDigits:2}) : Number(x.toFixed(2)).toString();
}
function quantile(a,p){
  const x=[...a].sort((m,n)=>m-n), pos=(x.length-1)*p, lo=Math.floor(pos), hi=Math.ceil(pos);
  return lo===hi?x[lo]:x[lo]+(x[hi]-x[lo])*(pos-lo);
}
function classes(a){
  const min=Math.min(...a), max=Math.max(...a);
  if(min===max) return [{lo:min-0.5,hi:max+0.5,mid:min,count:a.length}];
  let k=$("classCount").value==="auto"?Math.ceil(Math.sqrt(a.length)):Number($("classCount").value);
  k=Math.max(3,Math.min(30,k));
  const w=(max-min)/k, out=[];
  for(let i=0;i<k;i++){
    const lo=min+i*w, hi=i===k-1?max:min+(i+1)*w;
    out.push({lo,hi,mid:(lo+hi)/2,count:0});
  }
  a.forEach(v=>{
    let i=Math.floor((v-min)/w); if(i>=k)i=k-1;
    out[i].count++;
  });
  return out;
}
function setupCanvas(c){
  const dpr=window.devicePixelRatio||1, r=c.getBoundingClientRect(), w=Math.max(300,r.width), h=360;
  c.width=w*dpr; c.height=h*dpr; c.style.height=h+"px";
  const ctx=c.getContext("2d"); ctx.setTransform(dpr,0,0,dpr,0,0);
  return {ctx,w,h};
}
function clearCanvas(c){ const {ctx,w,h}=setupCanvas(c); ctx.clearRect(0,0,w,h); return {ctx,w,h}; }
function drawBase(ctx,w,h,title,xLabel,yLabel){
  const m={l:58,r:24,t:22,b:54};
  ctx.font="12px Segoe UI,Arial,sans-serif";
  return m;
}
function grid(ctx,m,w,h,minX,maxX,minY,maxY,showGrid=true){
  if(showGrid){
    ctx.strokeStyle="#e7edf5";ctx.lineWidth=1;
    for(let i=0;i<=5;i++){let y=h-m.b-(h-m.t-m.b)*i/5;ctx.beginPath();ctx.moveTo(m.l,y);ctx.lineTo(w-m.r,y);ctx.stroke();}
  }
  ctx.strokeStyle="#7f8da3";ctx.lineWidth=1.4;
  ctx.beginPath();ctx.moveTo(m.l,m.t);ctx.lineTo(m.l,h-m.b);ctx.lineTo(w-m.r,h-m.b);ctx.stroke();
}
function scales(w,h,m,minX,maxX,minY,maxY){
  const sx=x=>m.l+(x-minX)/(maxX-minX)*(w-m.l-m.r);
  const sy=y=>h-m.b-(y-minY)/(maxY-minY)*(h-m.t-m.b);
  return {sx,sy};
}
function labels(ctx,w,h,m,minX,maxX,minY,maxY,xText="",yText=""){
  ctx.fillStyle="#526176";ctx.font="12px Segoe UI,Arial,sans-serif";
  for(let i=0;i<=5;i++){
    const x=minX+(maxX-minX)*i/5, px=m.l+(w-m.l-m.r)*i/5;
    ctx.fillText(fmt(x),px-12,h-m.b+20);
    const y=minY+(maxY-minY)*i/5, py=h-m.b-(h-m.t-m.b)*i/5;
    ctx.fillText(fmt(y),8,py+4);
  }
  ctx.font="13px Segoe UI,Arial,sans-serif";ctx.fillText(xText,(w-ctx.measureText(xText).width)/2,h-10);
  ctx.save();ctx.translate(15,h/2);ctx.rotate(-Math.PI/2);ctx.fillText(yText,0,0);ctx.restore();
}
function drawHistogram(a){
  const c=$("histogram"), {ctx,w,h}=clearCanvas(c), m=drawBase(ctx,w,h);
  const cs=classes(a), maxY=Math.max(...cs.map(x=>x.count),1), minX=cs[0].lo,maxX=cs.at(-1).hi;
  const s=scales(w,h,m,minX,maxX,0,maxY*1.15); grid(ctx,m,w,h,minX,maxX,0,maxY*1.15,$("showGrid").checked);
  cs.forEach((b,i)=>{
    const x=s.sx(b.lo)+1, x2=s.sx(b.hi)-1, y=s.sy(b.count);
    ctx.fillStyle="#4f83e1";ctx.fillRect(x,y,Math.max(2,x2-x),h-m.b-y);
    ctx.strokeStyle="#fff";ctx.strokeRect(x,y,Math.max(2,x2-x),h-m.b-y);
    if(b.count) {ctx.fillStyle="#40536d";ctx.textAlign="center";ctx.fillText(b.count,(x+x2)/2,y-6);}
  });
  ctx.textAlign="left";labels(ctx,w,h,m,minX,maxX,0,maxY*1.15,"Value","Frequency");
}
function drawFrequency(a){
  const c=$("frequencyPolygon"),{ctx,w,h}=clearCanvas(c),m=drawBase(ctx,w,h),cs=classes(a);
  const maxY=Math.max(...cs.map(x=>x.count),1), step=cs.length>1?cs[1].mid-cs[0].mid:1;
  const pts=[{x:cs[0].mid-step,y:0},...cs.map(b=>({x:b.mid,y:b.count})),{x:cs.at(-1).mid+step,y:0}];
  const minX=pts[0].x,maxX=pts.at(-1).x,s=scales(w,h,m,minX,maxX,0,maxY*1.15);
  grid(ctx,m,w,h,minX,maxX,0,maxY*1.15,$("showGrid").checked);
  ctx.strokeStyle="#2563eb";ctx.lineWidth=3;ctx.beginPath();
  pts.forEach((p,i)=>{const x=s.sx(p.x),y=s.sy(p.y);i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke();
  pts.slice(1,-1).forEach(p=>{ctx.fillStyle="#fff";ctx.strokeStyle="#2563eb";ctx.lineWidth=2;ctx.beginPath();ctx.arc(s.sx(p.x),s.sy(p.y),4,0,Math.PI*2);ctx.fill();ctx.stroke()});
  labels(ctx,w,h,m,minX,maxX,0,maxY*1.15,"Class Mark","Frequency");
}
function drawOgive(a){
  const c=$("ogive"),{ctx,w,h}=clearCanvas(c),m=drawBase(ctx,w,h),cs=classes(a);
  let cum=0, pts=[{x:cs[0].lo,y:0}]; cs.forEach(b=>{cum+=b.count;pts.push({x:b.hi,y:cum})});
  const minX=cs[0].lo,maxX=cs.at(-1).hi,maxY=a.length,s=scales(w,h,m,minX,maxX,0,maxY*1.08);
  grid(ctx,m,w,h,minX,maxX,0,maxY*1.08,$("showGrid").checked);
  ctx.strokeStyle="#16a34a";ctx.lineWidth=3;ctx.beginPath();
  pts.forEach((p,i)=>{const x=s.sx(p.x),y=s.sy(p.y);i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke();
  pts.forEach(p=>{ctx.fillStyle="#fff";ctx.strokeStyle="#16a34a";ctx.lineWidth=2;ctx.beginPath();ctx.arc(s.sx(p.x),s.sy(p.y),4,0,Math.PI*2);ctx.fill();ctx.stroke()});
  labels(ctx,w,h,m,minX,maxX,0,maxY*1.08,"Upper Class Boundary","Cumulative Frequency");
}
function drawBoxplot(a){
  const c=$("boxplot"),{ctx,w,h}=clearCanvas(c),m={l:70,r:30,t:35,b:55};
  const q1=quantile(a,.25),med=quantile(a,.5),q3=quantile(a,.75),min=Math.min(...a),max=Math.max(...a),iqr=q3-q1;
  const lo=Math.max(min,q1-1.5*iqr),hi=Math.min(max,q3+1.5*iqr);
  const range=max-min||1,sx=x=>m.l+(x-min)/range*(w-m.l-m.r), y=h/2;
  ctx.strokeStyle="#7f8da3";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(m.l,y);ctx.lineTo(w-m.r,y);ctx.stroke();
  ctx.fillStyle="#526176";ctx.font="12px Segoe UI,Arial,sans-serif";
  for(let i=0;i<=5;i++){let x=min+range*i/5;ctx.fillText(fmt(x),sx(x)-10,y+70);ctx.strokeStyle="#e7edf5";ctx.beginPath();ctx.moveTo(sx(x),40);ctx.lineTo(sx(x),h-55);ctx.stroke();}
  ctx.strokeStyle="#2563eb";ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(sx(lo),y);ctx.lineTo(sx(q1),y);ctx.moveTo(sx(q3),y);ctx.lineTo(sx(hi),y);ctx.stroke();
  [lo,hi].forEach(x=>{ctx.beginPath();ctx.moveTo(sx(x),y-28);ctx.lineTo(sx(x),y+28);ctx.stroke()});
  ctx.fillStyle="#dbeafe";ctx.fillRect(sx(q1),y-38,Math.max(2,sx(q3)-sx(q1)),76);
  ctx.strokeStyle="#2563eb";ctx.strokeRect(sx(q1),y-38,sx(q3)-sx(q1),76);
  ctx.strokeStyle="#dc2626";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(sx(med),y-38);ctx.lineTo(sx(med),y+38);ctx.stroke();
  ctx.fillStyle="#14213d";ctx.font="12px Segoe UI,Arial,sans-serif";ctx.textAlign="center";
  ctx.fillText("Min "+fmt(min),sx(min),y-52);ctx.fillText("Q1 "+fmt(q1),sx(q1),y+58);ctx.fillText("Median "+fmt(med),sx(med),y-52);ctx.fillText("Q3 "+fmt(q3),sx(q3),y+58);ctx.fillText("Max "+fmt(max),sx(max),y-52);
  ctx.textAlign="left";
}
function stemLeaf(a){
  const vals=[...a].sort((x,y)=>x-y);
  const scale=vals.every(Number.isInteger)?1:10;
  const groups={};
  vals.forEach(v=>{
    const n=Math.round(v*scale), stem=Math.floor(n/10), leaf=Math.abs(n%10);
    (groups[stem]??=[]).push(leaf);
  });
  let html='<div class="stem-head">Stem | Leaf</div>';
  Object.keys(groups).sort((x,y)=>Number(x)-Number(y)).forEach(k=>html+=`<div><b>${k}</b> | ${groups[k].join(" ")}</div>`);
  html+=`<p class="stem-key">Key: 2 | 5 means approximately ${scale===1?"25":"2.5"}${scale===1?"":" (when one decimal place is present)"}</p>`;
  $("stemLeaf").innerHTML=html;
}
function parseCategories(text,a){
  const lines=String(text||"").split(/\n+/).map(x=>x.trim()).filter(Boolean), out=[];
  lines.forEach(line=>{
    const m=line.match(/^(.+?)\s*[:=]\s*(-?[\d.]+)\s*$/);
    if(m) out.push({label:m[1].trim(),value:Number(m[2])});
  });
  if(out.length) return out;
  const freq={}; a.forEach(v=>{const k=String(v);freq[k]=(freq[k]||0)+1});
  return Object.entries(freq).map(([label,value])=>({label,value}));
}
function drawBar(data){
  const c=$("barChart"),{ctx,w,h}=clearCanvas(c),m={l:58,r:24,t:25,b:65},maxY=Math.max(...data.map(d=>d.value),1);
  const n=data.length, chartW=w-m.l-m.r, bw=Math.min(80,chartW/n*.65),gap=chartW/n;
  grid(ctx,m,w,h,0,n,0,maxY*1.15,$("showGrid").checked);
  data.forEach((d,i)=>{
    const x=m.l+gap*i+gap/2-bw/2,y=h-m.b-d.value/(maxY*1.15)*(h-m.t-m.b);
    ctx.fillStyle="#7c5ce5";ctx.fillRect(x,y,bw,h-m.b-y);
    ctx.fillStyle="#40536d";ctx.font="12px Segoe UI,Arial,sans-serif";ctx.textAlign="center";ctx.fillText(fmt(d.value),x+bw/2,y-6);
    let lab=d.label.length>12?d.label.slice(0,11)+"…":d.label;ctx.fillText(lab,x+bw/2,h-m.b+22);
  });
  ctx.textAlign="left";ctx.font="13px Segoe UI,Arial,sans-serif";ctx.fillText("Category",w/2-25,h-10);
  ctx.save();ctx.translate(15,h/2);ctx.rotate(-Math.PI/2);ctx.fillText("Frequency / Value",0,0);ctx.restore();
}
function drawPie(data){
  const c=$("pieChart"),{ctx,w,h}=clearCanvas(c),cx=w*.43,cy=h/2,r=Math.min(w*.28,140),total=data.reduce((s,d)=>s+d.value,0);
  if(total<=0)return;
  let angle=-Math.PI/2;const palette=["#2563eb","#7c5ce5","#16a34a","#f59e0b","#dc2626","#0891b2","#db2777","#64748b","#84cc16","#9333ea"];
  data.forEach((d,i)=>{
    const next=angle+d.value/total*Math.PI*2;
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,angle,next);ctx.closePath();ctx.fillStyle=palette[i%palette.length];ctx.fill();ctx.strokeStyle="#fff";ctx.lineWidth=2;ctx.stroke();
    angle=next;
  });
  ctx.font="12px Segoe UI,Arial,sans-serif";ctx.textAlign="left";
  data.forEach((d,i)=>{const y=35+i*24;ctx.fillStyle=palette[i%palette.length];ctx.fillRect(w*.72,y-10,13,13);ctx.fillStyle="#40536d";const pct=d.value/total*100;ctx.fillText(`${d.label} (${fmt(pct)}%)`,w*.72+20,y);});
}
function summary(a){
  const q1=quantile(a,.25),med=quantile(a,.5),q3=quantile(a,.75);
  $("graphSummary").innerHTML=`<div class="graph-summary"><div><span>n</span><strong>${a.length}</strong></div><div><span>Minimum</span><strong>${fmt(Math.min(...a))}</strong></div><div><span>Mean</span><strong>${fmt(mean(a))}</strong></div><div><span>Median</span><strong>${fmt(med)}</strong></div><div><span>Maximum</span><strong>${fmt(Math.max(...a))}</strong></div><div><span>IQR</span><strong>${fmt(q3-q1)}</strong></div></div>`;
}
function generateAllGraphs(){
  const a=parseNums($("graphData").value),err=$("graphError");
  if(a.length<2){err.textContent="Please enter at least 2 numerical observations.";return;}
  err.textContent=""; summary(a);
  drawHistogram(a);drawFrequency(a);drawOgive(a);drawBoxplot(a);stemLeaf(a);
  const cats=parseCategories($("categoryData").value,a);drawBar(cats);drawPie(cats);
  $("chartsArea").classList.add("generated");
}
function loadSampleGraphData(){
  $("graphData").value="12, 15, 18, 20, 20, 22, 25, 28, 30, 32, 35, 35, 38, 40, 42, 45, 45, 48, 50, 52";
  $("categoryData").value="Male: 40\nFemale: 60\nOther: 10";
  generateAllGraphs();
}
function clearGraphs(){
  $("graphData").value="";$("categoryData").value="";$("graphSummary").innerHTML="";$("graphError").textContent="";
  document.querySelectorAll(".charts-area canvas").forEach(c=>{const ctx=c.getContext("2d");ctx.clearRect(0,0,c.width,c.height)});
  $("stemLeaf").innerHTML="";
}
window.generateAllGraphs=generateAllGraphs;window.loadSampleGraphData=loadSampleGraphData;window.clearGraphs=clearGraphs;
window.addEventListener("resize",()=>{const a=parseNums($("graphData")?.value);if(a.length>1)generateAllGraphs()});
document.addEventListener("DOMContentLoaded",()=>generateAllGraphs());
})();
const D=window.DISTRIBUTIONS||[
{name:"Bernoulli",type:"Discrete",params:"p",key:"bernoulli"},{name:"Binomial",type:"Discrete",params:"n,p",key:"binomial"},
{name:"Geometric",type:"Discrete",params:"p",key:"geometric"},{name:"Negative Binomial",type:"Discrete",params:"r,p",key:"negbin"},
{name:"Hypergeometric",type:"Discrete",params:"N,K,n",key:"hyper"},{name:"Poisson",type:"Discrete",params:"lambda",key:"poisson"},
{name:"Discrete Uniform",type:"Discrete",params:"a,b",key:"duniform"},{name:"Categorical",type:"Discrete",params:"p1,p2,p3",key:"categorical"},
{name:"Multinomial",type:"Discrete",params:"n,p1,p2,p3",key:"multinomial"},{name:"Zipf",type:"Discrete",params:"s",key:"zipf"},
{name:"Logarithmic",type:"Discrete",params:"p",key:"logarithmic"},{name:"Skellam",type:"Discrete",params:"mu1,mu2",key:"skellam"},
{name:"Discrete Laplace",type:"Discrete",params:"p",key:"dlaplace"},{name:"Beta-Binomial",type:"Discrete",params:"n,alpha,beta",key:"betabin"},
{name:"Dirichlet-Multinomial",type:"Discrete",params:"n,a1,a2,a3",key:"dirichletmulti"},{name:"Borel",type:"Discrete",params:"lambda",key:"borel"},
{name:"Yule-Simon",type:"Discrete",params:"rho",key:"yulesimon"},{name:"Benford",type:"Discrete",params:"base",key:"benford"},
{name:"Bivariate Poisson",type:"Discrete",params:"l1,l2,l3",key:"bipoisson"},{name:"Chinese Restaurant Process",type:"Discrete",params:"alpha,n",key:"crp"},
{name:"Uniform",type:"Continuous",params:"a,b",key:"uniform"},{name:"Normal",type:"Continuous",params:"mu,sigma",key:"normal"},
{name:"Exponential",type:"Continuous",params:"lambda",key:"exponential"},{name:"Gamma",type:"Continuous",params:"shape,scale",key:"gamma"},
{name:"Beta",type:"Continuous",params:"alpha,beta",key:"beta"},{name:"Weibull",type:"Continuous",params:"shape,scale",key:"weibull"},
{name:"Lognormal",type:"Continuous",params:"mu,sigma",key:"lognormal"},{name:"Cauchy",type:"Continuous",params:"x0,gamma",key:"cauchy"},
{name:"Student's t",type:"Continuous",params:"df",key:"t"},{name:"F",type:"Continuous",params:"df1,df2",key:"f"},
{name:"Chi-Square",type:"Continuous",params:"df",key:"chisq"},{name:"Logistic",type:"Continuous",params:"mu,s",key:"logistic"},
{name:"Laplace",type:"Continuous",params:"mu,b",key:"laplace"},{name:"Pareto",type:"Continuous",params:"xm,alpha",key:"pareto"},
{name:"Rayleigh",type:"Continuous",params:"sigma",key:"rayleigh"},{name:"Gumbel",type:"Continuous",params:"mu,beta",key:"gumbel"},
{name:"Triangular",type:"Continuous",params:"a,m,b",key:"triangular"},{name:"Erlang",type:"Continuous",params:"k,lambda",key:"erlang"},
{name:"Inverse Gaussian",type:"Continuous",params:"mu,lambda",key:"invgauss"},{name:"Fisher's z",type:"Continuous",params:"z,df",key:"fisherz"}];

function menuInit(){const b=document.querySelector(".menu-btn"),m=document.querySelector(".menu");if(!b||!m)return;b.onclick=(e)=>{e.stopPropagation();m.classList.toggle("open")};document.addEventListener("click",e=>{if(!m.contains(e.target)&&e.target!==b)m.classList.remove("open")})}menuInit();

function nums(v){return v.split(",").map(Number).filter(Number.isFinite)} function mean(a){return a.reduce((s,x)=>s+x,0)/a.length}
function median(a){a=[...a].sort((x,y)=>x-y);return a.length%2?a[(a.length-1)/2]:(a[a.length/2-1]+a[a.length/2])/2}
function sd(a){let m=mean(a);return Math.sqrt(a.reduce((s,x)=>s+(x-m)**2,0)/(a.length-1))}
function descGraphs(a){
 const sorted=[...a].sort((x,y)=>x-y), n=a.length;
 const freq=new Map(); sorted.forEach(x=>freq.set(x,(freq.get(x)||0)+1));
 const vals=[...freq.keys()], fs=[...freq.values()];
 const min=sorted[0], max=sorted[n-1];
 const bins=Math.max(3,Math.min(10,Math.ceil(Math.sqrt(n))));
 const width=max===min?1:(max-min)/bins;
 const edges=Array.from({length:bins+1},(_,i)=>min+i*width);
 const counts=Array(bins).fill(0); a.forEach(x=>{let j=max===min?0:Math.min(bins-1,Math.floor((x-min)/width));counts[j]++});
 const W=720,H=360,p=52;
 const sx=(x,x0=min,x1=max===min?min+1:max)=>p+(x-x0)/(x1-x0)*(W-2*p);
 const maxF=Math.max(...counts, ...fs, 1);
 const sy=f=>H-p-f/maxF*(H-2*p);
 const axis=`<line x1="${p}" y1="${H-p}" x2="${W-p}" y2="${H-p}" class="bi-axis"/><line x1="${p}" y1="${p}" x2="${p}" y2="${H-p}" class="bi-axis"/>`;
 const title=t=>`<h4>${t}</h4>`;
 // Histogram
 let hist=axis;
 counts.forEach((c,i)=>{const x0=edges[i],x1=edges[i+1],rx=sx(x0),rw=sx(x1)-rx;hist+=`<rect x="${rx}" y="${sy(c)}" width="${Math.max(1,rw-1)}" height="${H-p-sy(c)}" class="bi-bar"><title>Class ${i+1}: ${c}</title></rect>`});
 hist+=`<text x="${W/2}" y="${H-10}" text-anchor="middle" class="bi-label">Value</text><text x="16" y="${H/2}" text-anchor="middle" transform="rotate(-90 16 ${H/2})" class="bi-label">Frequency</text>`;
 // Frequency polygon
 let poly=axis; const pts=counts.map((c,i)=>`${sx((edges[i]+edges[i+1])/2)},${sy(c)}`).join(' '); poly+=`<polyline points="${pts}" fill="none" class="bi-regline"/>`;counts.forEach((c,i)=>poly+=`<circle cx="${sx((edges[i]+edges[i+1])/2)}" cy="${sy(c)}" r="4" class="bi-point"/>`);
 // Ogive cumulative curve
 let cum=0, ogPts=`${sx(min)},${sy(0)}`; counts.forEach((c,i)=>{cum+=c;ogPts+=` ${sx(edges[i+1])},${sy(cum)}`});
 let og=axis+`<polyline points="${ogPts}" fill="none" class="bi-regline"/>`; cum=0; counts.forEach((c,i)=>{cum+=c;og+=`<circle cx="${sx(edges[i+1])}" cy="${sy(cum)}" r="4" class="bi-point"/>`});
 // Boxplot
 const q=(arr,prob)=>{let pos=(arr.length-1)*prob,lo=Math.floor(pos),hi=Math.ceil(pos);return lo===hi?arr[lo]:arr[lo]+(arr[hi]-arr[lo])*(pos-lo)};
 const q1=q(sorted,.25),med=q(sorted,.5),q3=q(sorted,.75),iqr=q3-q1,lo=sorted.find(x=>x>=q1-1.5*iqr)??min,hi=[...sorted].reverse().find(x=>x<=q3+1.5*iqr)??max;
 const bxMin=min,bxMax=max===min?min+1:max,bsx=x=>p+(x-bxMin)/(bxMax-bxMin)*(W-2*p), cy=H/2;
 let box=axis+`<line x1="${bsx(lo)}" y1="${cy}" x2="${bsx(q1)}" y2="${cy}" class="bi-axis"/><line x1="${bsx(q3)}" y1="${cy}" x2="${bsx(hi)}" y2="${cy}" class="bi-axis"/><line x1="${bsx(lo)}" y1="${cy-22}" x2="${bsx(lo)}" y2="${cy+22}" class="bi-axis"/><line x1="${bsx(hi)}" y1="${cy-22}" x2="${bsx(hi)}" y2="${cy+22}" class="bi-axis"/><rect x="${bsx(q1)}" y="${cy-35}" width="${Math.max(2,bsx(q3)-bsx(q1))}" height="70" fill="none" class="bi-point"/><line x1="${bsx(med)}" y1="${cy-35}" x2="${bsx(med)}" y2="${cy+35}" class="bi-regline"/><text x="${W/2}" y="${H-10}" text-anchor="middle" class="bi-label">Value</text>`;
 // Stem and leaf
 const leaves=new Map(); sorted.forEach(x=>{const k=Math.floor(x/10), leaf=x-k*10;if(!leaves.has(k))leaves.set(k,[]);leaves.get(k).push(leaf)});
 let stem=`<div class="stemleaf"><div><b>Stem</b> | <b>Leaves</b></div>`;[...leaves.keys()].sort((a,b)=>a-b).forEach(k=>stem+=`<div>${k} | ${leaves.get(k).join(' ')}</div>`);stem+=`<small>Key: 4 | 5 = 45</small></div>`;
 // Bar chart and pie chart for distinct values
 const chartVals=vals.slice(0,20), chartFs=fs.slice(0,20), barMax=Math.max(...chartFs,1), bw=(W-2*p)/Math.max(chartVals.length,1);
 let bar=axis;chartVals.forEach((v,i)=>{const h=chartFs[i]/barMax*(H-2*p),x=p+i*bw+3;bar+=`<rect x="${x}" y="${H-p-h}" width="${Math.max(2,bw-6)}" height="${h}" class="bi-bar"><title>${v}: ${chartFs[i]}</title></rect><text x="${x+bw/2-3}" y="${H-p+18}" text-anchor="middle" class="bi-label">${String(v).slice(0,8)}</text>`});
 let pie=`<svg viewBox="0 0 420 320" role="img"><circle cx="210" cy="155" r="95" fill="none" class="bi-axis"/>`;
 const total=chartFs.reduce((s,x)=>s+x,0); let angle=-Math.PI/2; const cx=210,cy2=155,r=95;
 chartFs.forEach((f,i)=>{const a2=angle+2*Math.PI*f/total, x1=cx+r*Math.cos(angle),y1=cy2+r*Math.sin(angle),x2=cx+r*Math.cos(a2),y2=cy2+r*Math.sin(a2),large=(a2-angle)>Math.PI?1:0;pie+=`<path d="M ${cx} ${cy2} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z" fill="none" stroke="currentColor" stroke-width="${Math.max(8,Math.min(45,180*f/total))}" opacity="0.55"><title>${chartVals[i]}: ${(100*f/total).toFixed(2)}%</title></path>`;angle=a2});pie+=`<text x="210" y="300" text-anchor="middle" class="bi-label">Pie chart of frequencies</text></svg>`;
 return `<div class="desc-graphs"><h3>Graphs &amp; Visualizations</h3><div class="desc-graph-grid">
 <div class="desc-graph">${title('Histogram')}<svg viewBox="0 0 ${W} ${H}">${hist}</svg></div>
 <div class="desc-graph">${title('Frequency Polygon')}<svg viewBox="0 0 ${W} ${H}">${poly}</svg></div>
 <div class="desc-graph">${title('Cumulative Frequency Curve (Ogive)')}<svg viewBox="0 0 ${W} ${H}">${og}</svg></div>
 <div class="desc-graph">${title('Boxplot')}<svg viewBox="0 0 ${W} ${H}">${box}</svg></div>
 <div class="desc-graph">${title('Bar Chart')}<svg viewBox="0 0 ${W} ${H}">${bar}</svg></div>
 <div class="desc-graph">${title('Pie Chart')}${pie}</div>
 <div class="desc-graph">${title('Stem-and-Leaf Plot')}${stem}</div>
 </div><p class="graph-note">Graphs are generated automatically from the entered observations. For continuous data, histogram/frequency polygon/ogive use automatically selected class intervals; bar and pie charts use distinct observed values.</p></div>`;
}

function parseClassIntervals(raw,a){
 const parts=String(raw||'').split(',').map(s=>s.trim()).filter(Boolean), out=[];
 for(const part of parts){const m=part.match(/^\s*(-?\d+(?:\.\d+)?)\s*-\s*(-?\d+(?:\.\d+)?)(?:\s*:\s*(\d+(?:\.\d+)?))?\s*$/);if(!m)continue;const lo=Number(m[1]),hi=Number(m[2]);if(!(hi>lo))continue;const supplied=m[3]!=null?Number(m[3]):null;const f=supplied!=null?supplied:a.filter(v=>v>=lo&&v<(hi===Math.max(...a)?hi+1e-12:hi)).length;out.push({lo,hi,f,label:`${lo}–${hi}`});}
 if(out.length){const last=out[out.length-1];const mx=Math.max(...a);if(last.hi>=mx)last.f=last.f;}return out;
}
function classIntervalTable(raw,a){const cs=parseClassIntervals(raw,a);if(!cs.length)return '';return `<div class="desc-detail"><h4>Class-Interval Frequency Table</h4><table class="bi-table"><thead><tr><th>Class Interval</th><th>Frequency</th><th>Relative Frequency</th><th>Percentage</th></tr></thead><tbody>${cs.map(c=>`<tr><td>${c.label}</td><td>${c.f}</td><td>${(c.f/a.length).toFixed(5)}</td><td>${(c.f*100/a.length).toFixed(2)}%</td></tr>`).join('')}</tbody></table><p class="graph-note">Syntax used: <b>10-20, 20-30, 30-40</b> or with frequencies <b>10-20:5, 20-30:8, 30-40:12</b>.</p></div>`;}
function calcDesc(){
 const el=document.getElementById("data"); if(!el)return;
 const a=nums(el.value.replace(/[\s;\n\t]+/g,","));
 const out=document.getElementById("descResult");
 if(a.length<2){out.innerHTML='<div class="bi-warn">Please enter at least two numerical observations.</div>';return;}
 const n=a.length, m=mean(a), sorted=[...a].sort((x,y)=>x-y);
 const sum=a.reduce((s,x)=>s+x,0), min=sorted[0], max=sorted[n-1], range=max-min;
 const med=median(a), q1=median(sorted.slice(0,Math.floor(n/2))), q3=median(sorted.slice(Math.ceil(n/2)));
 const variance=a.reduce((s,x)=>s+(x-m)**2,0)/(n-1), S=Math.sqrt(variance), se=S/Math.sqrt(n);
 const raw=k=>a.reduce((s,x)=>s+x**k,0)/n;
 const central=k=>a.reduce((s,x)=>s+(x-m)**k,0)/n;
 const mu2=central(2),mu3=central(3),mu4=central(4);
 const skew=mu2>0?mu3/(mu2**1.5):NaN, kurt=mu2>0?mu4/(mu2**2):NaN, excess=kurt-3;
 const freq=new Map();a.forEach(x=>freq.set(x,(freq.get(x)||0)+1));
 const maxFreq=Math.max(...freq.values()), modes=[...freq.entries()].filter(([v,c])=>c===maxFreq).map(x=>x[0]);
 const mode=(maxFreq===1)?"No mode":modes.join(", ");
 const cv=m!==0?S/Math.abs(m)*100:NaN;
 const box=(label,val)=>`<div class="result-box"><span>${label}</span><strong>${Number.isFinite(val)?val.toFixed(5):"—"}</strong></div>`;
 out.innerHTML=`
 <div class="result-grid">
 ${box("n",n)}${box("Σx",sum)}${box("Mean",m)}<div class="result-box"><span>Mode</span><strong>${mode}</strong></div>
 ${box("Median",med)}${box("Minimum",min)}${box("Maximum",max)}${box("Range",range)}${box("Q1",q1)}${box("Q3",q3)}${box("IQR",q3-q1)}
 ${box("Sample Variance",variance)}${box("Sample SD",S)}${box("Standard Error",se)}${box("CV (%)",cv)}
 </div>
 <div class="desc-detail"><h4>Moments</h4>
 <table class="bi-table"><thead><tr><th>Measure</th><th>Value</th></tr></thead><tbody>
 <tr><td>1st Raw Moment</td><td>${raw(1).toFixed(5)}</td></tr><tr><td>2nd Raw Moment</td><td>${raw(2).toFixed(5)}</td></tr><tr><td>3rd Raw Moment</td><td>${raw(3).toFixed(5)}</td></tr><tr><td>4th Raw Moment</td><td>${raw(4).toFixed(5)}</td></tr>
 <tr><td>1st Central Moment</td><td>0.00000</td></tr><tr><td>2nd Central Moment</td><td>${mu2.toFixed(5)}</td></tr><tr><td>3rd Central Moment</td><td>${mu3.toFixed(5)}</td></tr><tr><td>4th Central Moment</td><td>${mu4.toFixed(5)}</td></tr>
 <tr><td>Skewness</td><td>${skew.toFixed(5)}</td></tr><tr><td>Kurtosis</td><td>${kurt.toFixed(5)}</td></tr><tr><td>Excess Kurtosis</td><td>${excess.toFixed(5)}</td></tr>
 </tbody></table>
 <details class="bi-formula"><summary>Show formulas / laws</summary><div class="bi-formula-body">
 <div class="formula-box">\\(\\bar{x}=\\frac{\\sum x}{n}\\)</div><div class="formula-box">\\(s^2=\\frac{\\sum(x-\\bar{x})^2}{n-1}\\)</div><div class="formula-box">\\(s=\\sqrt{s^2}\\)</div><div class="formula-box">\\(SE(\\bar{x})=\\frac{s}{\\sqrt n}\\)</div>
 <div class="formula-box">\\(\\mu'_r=\\frac{1}{n}\\sum x^r\\)</div><div class="formula-box">\\(\\mu_r=\\frac{1}{n}\\sum(x-\\bar{x})^r\\)</div><div class="formula-box">\\(\\text{Skewness}=\\frac{\\mu_3}{\\mu_2^{3/2}}\\)</div><div class="formula-box">\\(\\text{Kurtosis}=\\frac{\\mu_4}{\\mu_2^2}\\)</div>
 </div></details></div>${classIntervalTable(document.getElementById("classIntervals")?.value,a)}${descGraphs(a)}`;
 if(window.MathJax?.typesetPromise)window.MathJax.typesetPromise([out]).catch(()=>{});
}

function logGamma(z){const g=7,C=[0.9999999999998099,676.5203681218851,-1259.1392167224028,771.3234287776531,-176.6150291621406,12.507343278686905,-0.13857109526572012,9.984369578019572e-6,1.5056327351493116e-7];if(z<.5)return Math.log(Math.PI)-Math.log(Math.sin(Math.PI*z))-logGamma(1-z);z-=1;let x=C[0];for(let i=1;i<C.length;i++)x+=C[i]/(z+i);let t=z+g+.5;return .5*Math.log(2*Math.PI)+(z+.5)*Math.log(t)-t+Math.log(x)}
function gamma(z){return Math.exp(logGamma(z))} function logChoose(n,k){if(k<0||k>n)return -Infinity;return logGamma(n+1)-logGamma(k+1)-logGamma(n-k+1)}
function erf(x){let s=x<0?-1:1;x=Math.abs(x);let a1=.254829592,a2=-.284496736,a3=1.421413741,a4=-1.453152027,a5=1.061405429,p=.3275911,t=1/(1+p*x);return s*(1-(((((a5*t+a4)*t+a3)*t+a2)*t+a1)*t)*Math.exp(-x*x))}
function normalPdf(x,m,s){return Math.exp(-.5*((x-m)/s)**2)/(s*Math.sqrt(2*Math.PI))} function normalCdf(x,m,s){return .5*(1+erf((x-m)/(s*Math.sqrt(2))))}
function simpson(f,a,b,n=800){if(b<=a)return 0;if(n%2)n++;let h=(b-a)/n,sum=f(a)+f(b);for(let i=1;i<n;i++)sum+=(i%2?4:2)*f(a+i*h);return sum*h/3}
function betaFunc(a,b){return Math.exp(logGamma(a)+logGamma(b)-logGamma(a+b))} let FAST_MATH=false;
function integrateCDF(pdf,x,lo){
if(FAST_MATH)return 0;if(!Number.isFinite(x))return x>0?1:0;let a=lo,b=x;if(b<=a)return 0;return Math.min(1,Math.max(0,simpson(pdf,a,b,700)))}
function poissonPmf(k,l){if(k<0||Math.floor(k)!=k)return 0;return Math.exp(-l+k*Math.log(l)-logGamma(k+1))}
function binomPmf(k,n,p){if(k<0||k>n||Math.floor(k)!=k)return 0;return Math.exp(logChoose(n,k)+k*Math.log(p)+(n-k)*Math.log(1-p))}
function geometricPmf(k,p){return k<1?0:p*Math.pow(1-p,k-1)} function negbinPmf(k,r,p){if(k<0||Math.floor(k)!=k)return 0;return Math.exp(logChoose(k+r-1,k)+r*Math.log(p)+k*Math.log(1-p))}
function betaPdf(x,a,b){return x<=0||x>=1?0:Math.pow(x,a-1)*Math.pow(1-x,b-1)/betaFunc(a,b)}
function gammaPdf(x,k,theta){return x<0?0:Math.pow(x,k-1)*Math.exp(-x/theta)/(gamma(k)*Math.pow(theta,k))}
function tPdf(x,v){return gamma((v+1)/2)/(Math.sqrt(v*Math.PI)*gamma(v/2))*Math.pow(1+x*x/v,-(v+1)/2)}
function fPdf(x,d1,d2){if(x<=0)return 0;return Math.sqrt(Math.pow(d1*x,d1)*Math.pow(d2,d2)/Math.pow(d1*x+d2,d1+d2))/x/betaFunc(d1/2,d2/2)}
const defaults={p:.35,n:10,r:4,N:30,K:12,lambda:3,a:0,b:1,p1:.2,p2:.3,p3:.5,s:2,mu1:4,mu2:2,alpha:2,beta:3,a1:2,a2:3,a3:4,base:10,z:1,df:10,df1:8,df2:12,shape:2,scale:2,mu:0,sigma:1,x0:0,gamma:1,xm:1,rho:3,k:4,m:1};
function distSpec(){let q=new URLSearchParams(location.search).get("name");return D.find(d=>d.name.toLowerCase()===String(q||"Normal").toLowerCase())||D.find(d=>d.name==="Normal")}
function getParams(){let o={};document.querySelectorAll("#fields input[data-p]").forEach(i=>o[i.dataset.p]=Number(i.value));return o}
function besseli(n,z){let sum=0;for(let k=0;k<60;k++){let term=Math.pow(z/2,2*k+n)/(gamma(k+1)*gamma(k+n+1));sum+=term;if(Math.abs(term)<1e-14*Math.max(1,sum))break}return sum}

function calcCore(k,x,p){
const q=p.p??0;
switch(k){
case"bernoulli":return{v:x===1?q:x===0?1-q:0,c:x<0?0:x<1?1-q:1,m:q,vv:q*(1-q),range:[-0.1,1.1],discrete:true};
case"binomial":{let n=Math.round(p.n),v=binomPmf(Math.round(x),n,q),c=0;for(let i=0;i<=Math.floor(x);i++)c+=binomPmf(i,n,q);return{v,c:Math.min(1,c),m:n*q,vv:n*q*(1-q),range:[0,n],discrete:true}}
case"geometric":{let kx=Math.floor(x),v=geometricPmf(kx,q),c=kx<1?0:1-Math.pow(1-q,kx);return{v,c,m:1/q,vv:(1-q)/(q*q),range:[1,Math.max(10,Math.ceil(8/q))],discrete:true}}
case"poisson":{let l=p.lambda,kx=Math.floor(x),v=poissonPmf(kx,l),c=0;for(let i=0;i<=kx;i++)c+=poissonPmf(i,l);return{v,c,m:l,vv:l,range:[0,Math.max(10,Math.ceil(l+6*Math.sqrt(l)))],discrete:true}}
case"uniform":{let a=p.a,b=p.b,v=x>=a&&x<=b?1/(b-a):0,c=x<=a?0:x>=b?1:(x-a)/(b-a);return{v,c,m:(a+b)/2,vv:(b-a)**2/12,range:[a,b],discrete:false}}
case"normal":{let m=p.mu,s=p.sigma;return{v:normalPdf(x,m,s),c:normalCdf(x,m,s),m,vv:s*s,range:[m-4*s,m+4*s],discrete:false}}
case"exponential":{let l=p.lambda,v=x<0?0:l*Math.exp(-l*x),c=x<0?0:1-Math.exp(-l*x);return{v,c,m:1/l,vv:1/(l*l),range:[0,Math.max(5/l,5)],discrete:false}}
case"gamma":{let k=p.shape,th=p.scale,v=gammaPdf(x,k,th),c=integrateCDF(z=>gammaPdf(z,k,th),x,0);return{v,c,m:k*th,vv:k*th*th,range:[0,k*th+6*Math.sqrt(k*th*th)],discrete:false}}
case"beta":{let a=p.alpha,b=p.beta,v=betaPdf(x,a,b),c=integrateCDF(z=>betaPdf(z,a,b),x,0),m=a/(a+b),vv=a*b/((a+b)**2*(a+b+1));return{v,c,m,vv,range:[0,1],discrete:false}}
case"weibull":{let k=p.shape,th=p.scale,v=x<0?0:(k/th)*Math.pow(x/th,k-1)*Math.exp(-Math.pow(x/th,k)),c=x<0?0:1-Math.exp(-Math.pow(x/th,k)),m=th*gamma(1+1/k),vv=th*th*(gamma(1+2/k)-Math.pow(gamma(1+1/k),2));return{v,c,m,vv,range:[0,th*4],discrete:false}}
case"lognormal":{let m=p.mu,s=p.sigma,v=x<=0?0:Math.exp(-.5*((Math.log(x)-m)/s)**2)/(x*s*Math.sqrt(2*Math.PI)),c=x<=0?0:normalCdf(Math.log(x),m,s);return{v,c,m:Math.exp(m+s*s/2),vv:(Math.exp(s*s)-1)*Math.exp(2*m+s*s),range:[.001,Math.exp(m+4*s)],discrete:false}}
case"cauchy":{let x0=p.x0,g=p.gamma,v=1/(Math.PI*g*(1+((x-x0)/g)**2)),c=.5+Math.atan((x-x0)/g)/Math.PI;return{v,c,m:NaN,vv:NaN,range:[x0-10*g,x0+10*g],discrete:false}}
case"t":{let v=p.df,z=x,den=tPdf(z,v),c=.5+Math.sign(z)*integrateCDF(t=>tPdf(t,v),Math.abs(z),0);return{v:den,c,m:v>1?0:NaN,vv:v>2?v/(v-2):NaN,range:[-5,5],discrete:false}}
case"f":{let d1=p.df1,d2=p.df2,v=fPdf(x,d1,d2),c=integrateCDF(z=>fPdf(z,d1,d2),x,0);return{v,c,m:d2>2?d2/(d2-2):NaN,vv:NaN,range:[.001,5],discrete:false}}
case"chisq":{let k=p.df,v=gammaPdf(x,k/2,2),c=integrateCDF(z=>gammaPdf(z,k/2,2),x,0);return{v,c,m:k,vv:2*k,range:[0,k+6*Math.sqrt(2*k)],discrete:false}}
case"logistic":{let m=p.mu,s=p.s,v=Math.exp(-(x-m)/s)/(s*Math.pow(1+Math.exp(-(x-m)/s),2)),c=1/(1+Math.exp(-(x-m)/s));return{v,c,m,vv:Math.PI*Math.PI*s*s/3,range:[m-8*s,m+8*s],discrete:false}}
case"laplace":{let m=p.mu,b=p.b,v=Math.exp(-Math.abs(x-m)/b)/(2*b),c=x<m?.5*Math.exp((x-m)/b):1-.5*Math.exp(-(x-m)/b);return{v,c,m,vv:2*b*b,range:[m-8*b,m+8*b],discrete:false}}
case"pareto":{let xm=p.xm,a=p.alpha,v=x<xm?0:a*Math.pow(xm,a)/Math.pow(x,a+1),c=x<xm?0:1-Math.pow(xm/x,a);return{v,c,m:a>1?a*xm/(a-1):NaN,vv:a>2?a*xm*xm/((a-1)**2*(a-2)):NaN,range:[xm,xm*15],discrete:false}}
case"rayleigh":{let s=p.sigma,v=x<0?0:x/(s*s)*Math.exp(-x*x/(2*s*s)),c=x<0?0:1-Math.exp(-x*x/(2*s*s));return{v,c,m:s*Math.sqrt(Math.PI/2),vv:(4-Math.PI)*s*s/2,range:[0,4*s],discrete:false}}
case"gumbel":{let m=p.mu,b=p.beta,z=(x-m)/b,e=Math.exp(-z),v=Math.exp(-(z+e))/b,c=Math.exp(-e);return{v,c,m:m+.5772156649*b,vv:Math.PI*Math.PI*b*b/6,range:[m-6*b,m+8*b],discrete:false}}
case"triangular":{let a=p.a,m=p.m,b=p.b,v=x<a||x>b?0:x<=m?2*(x-a)/((b-a)*(m-a)):2*(b-x)/((b-a)*(b-m));let c=x<=a?0:x<=m?(x-a)**2/((b-a)*(m-a)):x<b?1-(b-x)**2/((b-a)*(b-m)):1;return{v,c,m:(a+m+b)/3,vv:(a*a+m*m+b*b-a*m-a*b-m*b)/18,range:[a,b],discrete:false}}
case"erlang":{let k=Math.round(p.k),l=p.lambda,th=1/l,v=gammaPdf(x,k,th),c=integrateCDF(z=>gammaPdf(z,k,th),x,0);return{v,c,m:k/l,vv:k/(l*l),range:[0,k/l+6*Math.sqrt(k/(l*l))],discrete:false}}
case"invgauss":{let m=p.mu,l=p.lambda,v=x<=0?0:Math.sqrt(l/(2*Math.PI*x**3))*Math.exp(-l*(x-m)**2/(2*m*m*x));return{v,c:NaN,m,vv:m**3/l,range:[.001,m*5],discrete:false}}
case"fisherz":return{v:normalPdf(x,0,1),c:normalCdf(x,0,1),m:0,vv:1/Math.max(1,p.df-3),range:[-4,4],discrete:false};
case"hyper":{let N=Math.round(p.N),K=Math.round(p.K),nn=Math.round(p.n),kx=Math.round(x),v=(kx<Math.max(0,nn-(N-K))||kx>Math.min(nn,K))?0:Math.exp(logChoose(K,kx)+logChoose(N-K,nn-kx)-logChoose(N,nn));let c=0;for(let i=Math.max(0,nn-(N-K));i<=Math.min(nn,K);i++)if(i<=kx)c+=Math.exp(logChoose(K,i)+logChoose(N-K,nn-i)-logChoose(N,nn));return{v,c,m:nn*K/N,vv:nn*(K/N)*(1-K/N)*(N-nn)/(N-1),range:[Math.max(0,nn-(N-K)),Math.min(nn,K)],discrete:true}}
case"duniform":{let a=Math.round(p.a),b=Math.round(p.b),kx=Math.round(x),v=kx>=a&&kx<=b?1/(b-a+1):0,c=kx<a?0:kx>=b?1:(kx-a+1)/(b-a+1);return{v,c,m:(a+b)/2,vv:((b-a+1)**2-1)/12,range:[a,b],discrete:true}}
case"categorical":{let ps=[p.p1,p.p2,p.p3],kx=Math.round(x),v=ps[kx-1]||0,c=ps.slice(0,Math.max(0,kx)).reduce((a,b)=>a+b,0);return{v,c,m:ps.reduce((a,z,i)=>a+(i+1)*z,0),vv:ps.reduce((a,z,i)=>a+(i+1)**2*z,0)-ps.reduce((a,z,i)=>a+(i+1)*z,0)**2,range:[1,3],discrete:true}}
case"multinomial":{let ps=[p.p1,p.p2,p.p3],nn=Math.round(p.n),mu=nn*ps[0],vv=nn*ps[0]*(1-ps[0]),kx=Math.round(x),v=Math.exp(logChoose(nn,kx)+kx*Math.log(ps[0])+(nn-kx)*Math.log(1-ps[0]));let c=0;for(let i=0;i<=kx;i++)c+=Math.exp(logChoose(nn,i)+i*Math.log(ps[0])+(nn-i)*Math.log(1-ps[0]));return{v,c,m:mu,vv,range:[0,nn],discrete:true}}
case"zipf":{let s=p.s,M=1000,Z=0;for(let i=1;i<=M;i++)Z+=1/Math.pow(i,s);let kx=Math.round(x),v=kx>=1&&kx<=M?1/(Math.pow(kx,s)*Z):0,c=0;for(let i=1;i<=Math.min(M,kx);i++)c+=1/(Math.pow(i,s)*Z);return{v,c,m:NaN,vv:NaN,range:[1,Math.min(50,M)],discrete:true}}
case"logarithmic":{let pp=p.p,kx=Math.round(x),v=kx>=1?-(1/Math.log(1-pp))*Math.pow(pp,kx)/kx:0,c=0;for(let i=1;i<=Math.min(500,kx);i++)c+=-(1/Math.log(1-pp))*Math.pow(pp,i)/i;return{v,c,m:pp/((pp-1)*Math.log(1-pp)),vv:NaN,range:[1,Math.max(20,Math.ceil(10/Math.max(.05,1-pp)))],discrete:true}}
case"skellam":{let a=p.mu1,b=p.mu2,kx=Math.round(x),v=Math.exp(-(a+b))*Math.pow(a/b,kx/2)*besseli(Math.abs(kx),2*Math.sqrt(a*b)),c=0;for(let i=-30;i<=kx;i++)c+=Math.exp(-(a+b))*Math.pow(a/b,i/2)*besseli(Math.abs(i),2*Math.sqrt(a*b));return{v,c:Math.max(0,Math.min(1,c)),m:a-b,vv:a+b,range:[Math.floor(a-b-6*Math.sqrt(a+b)),Math.ceil(a-b+6*Math.sqrt(a+b))],discrete:true}}
case"dlaplace":{let pp=p.p,kx=Math.round(x),v=(1-pp)/(1+pp)*Math.pow(pp,Math.abs(kx)),c=0;for(let i=-50;i<=kx;i++)c+=(1-pp)/(1+pp)*Math.pow(pp,Math.abs(i));return{v,c:Math.max(0,Math.min(1,c)),m:0,vv:2*pp/(1-pp)**2,range:[-20,20],discrete:true}}
case"betabin":{let nn=Math.round(p.n),a=p.alpha,b=p.beta,kx=Math.round(x),v=(kx>=0&&kx<=nn)?Math.exp(logChoose(nn,kx)+logGamma(kx+a)+logGamma(nn-kx+b)-logGamma(nn+a+b)+logGamma(a+b)-logGamma(a)-logGamma(b)):0,c=0;for(let i=0;i<=Math.min(nn,kx);i++)c+=(i>=0&&i<=nn)?Math.exp(logChoose(nn,i)+logGamma(i+a)+logGamma(nn-i+b)-logGamma(nn+a+b)+logGamma(a+b)-logGamma(a)-logGamma(b)):0;let m=nn*a/(a+b),vv=nn*a*b*(a+b+nn)/((a+b)**2*(a+b+1));return{v,c,m,vv,range:[0,nn],discrete:true}}
case"dirichletmulti":{let nn=Math.round(p.n),a=p.a1,b=p.a2,c0=p.a3,A=a+b+c0,kx=Math.round(x),v=(kx>=0&&kx<=nn)?Math.exp(logChoose(nn,kx)+logGamma(kx+a)+logGamma(nn-kx+b+c0)-logGamma(nn+A)+logGamma(A)-logGamma(a)-logGamma(b+c0)):0;return{v,c:NaN,m:nn*a/A,vv:nn*(a/A)*(1-a/A)*(A+nn)/(A+1),range:[0,nn],discrete:true}}
case"borel":{let l=p.lambda,kx=Math.round(x),v=kx>=1?Math.exp(-l*kx)*Math.pow(l*kx,kx-1)/gamma(kx+1):0;return{v,c:NaN,m:1/(1-l),vv:l/(1-l)**3,range:[1,Math.max(20,Math.ceil(10/(1-l)))],discrete:true}}
case"yulesimon":{let rr=p.rho,kx=Math.round(x),v=kx>=1?rr*Math.exp(logGamma(kx)+logGamma(rr+1)-logGamma(kx+rr+1)):0;return{v,c:NaN,m:rr/(rr-1),vv:rr**2/((rr-1)**2*(rr-2)),range:[1,30],discrete:true}}
case"benford":{let base=Math.round(p.base),d=Math.round(x),v=d>=1&&d<base?Math.log(1+1/d)/Math.log(base):0,c=0;for(let i=1;i<=Math.min(d,base-1);i++)c+=Math.log(1+1/i)/Math.log(base);return{v,c,m:NaN,vv:NaN,range:[1,base-1],discrete:true}}
case"bipoisson":{let l=p.l1+p.l3,kx=Math.round(x),v=poissonPmf(kx,l),c=0;for(let i=0;i<=kx;i++)c+=poissonPmf(i,l);return{v,c,m:l,vv:l,range:[0,Math.max(10,Math.ceil(l+6*Math.sqrt(l)))],discrete:true}}
case"crp":{let nn=Math.round(p.n),al=p.alpha,m=0;for(let i=1;i<=nn;i++)m+=al/(al+i-1);return{v:NaN,c:NaN,m,vv:NaN,range:[1,nn],discrete:true}}
default:return{v:NaN,c:NaN,m:NaN,vv:NaN,range:[-5,5],discrete:false}
}}

function fmt(v){return Number.isFinite(v)?v.toPrecision(8):"Undefined"}
function numericMoments(spec,p){
  const key=spec.key;
  const oldFast=FAST_MATH; FAST_MATH=true;
  // Closed-form moments for the distributions where they are standard and stable.
  let m=NaN,v=NaN,sk=NaN,ex=NaN,med=NaN,mode=NaN;
  const q=p.p??0, n=Math.round(p.n??10), r=Math.round(p.r??4), lam=p.lambda??3;
  switch(key){
    case "bernoulli": m=q; v=q*(1-q); sk=(v>0)?(1-2*q)/Math.sqrt(v):NaN; ex=(v>0)?(1-6*q*(1-q))/v:NaN; med=q<.5?0:q>.5?1:.5; mode=q<.5?0:q>.5?1:"0 and 1"; break;
    case "binomial": m=n*q; v=n*q*(1-q); sk=v? (1-2*q)/Math.sqrt(v):NaN; ex=v? (1-6*q*(1-q))/v:NaN; med=Math.floor(n*q+0.5); mode=(q===0?0:q===1?n:Math.floor((n+1)*q)); break;
    case "geometric": m=1/q; v=(1-q)/(q*q); sk=(2-q)/Math.sqrt(1-q); ex=6+(q*q)/(1-q); med=Math.ceil(-Math.log(2)/Math.log(1-q)); mode=1; break;
    case "negbin": m=r/q; v=r*(1-q)/(q*q); sk=(2-q)/Math.sqrt(r*(1-q)); ex=6/r+(q*q)/(r*(1-q)); med=Math.floor(r/q); mode=Math.floor((r-1)/q); break;
    case "poisson": m=lam; v=lam; sk=1/Math.sqrt(lam); ex=1/lam; med=Math.floor(lam+1/3-0.02/lam); mode=Math.floor(lam); break;
    case "duniform": {let a=p.a,b=p.b; m=(a+b)/2; v=((b-a+1)**2-1)/12; sk=0; ex=-6/5*( ((b-a+1)**2+1)/((b-a+1)**2-1) ); med=(a+b)/2; mode="all integers"; break;}
    case "uniform": {let a=p.a,b=p.b; m=(a+b)/2; v=(b-a)**2/12; sk=0; ex=-6/5; med=m; mode="all x∈[a,b]"; break;}
    case "normal": m=p.mu; v=p.sigma**2; sk=0; ex=0; med=m; mode=m; break;
    case "exponential": m=1/lam; v=1/lam**2; sk=2; ex=6; med=Math.log(2)/lam; mode=0; break;
    case "gamma": {let a=p.shape,th=p.scale; m=a*th; v=a*th*th; sk=2/Math.sqrt(a); ex=6/a; med=a>=1?th*(a-1/3):NaN; mode=a>=1?(a-1)*th:0; break;}
    case "beta": {let a=p.alpha,b=p.beta; m=a/(a+b); v=a*b/((a+b)**2*(a+b+1)); sk=2*(b-a)*Math.sqrt(a+b+1)/((a+b+2)*Math.sqrt(a*b)); ex=6*((a-b)**2*(a+b+1)-a*b*(a+b+2))/(a*b*(a+b+2)*(a+b+3)); med=(a>1&&b>1)?(a-1/3)/(a+b-2/3):NaN; mode=(a>1&&b>1)?(a-1)/(a+b-2):(a<=1&&b>1?0:(a>1&&b<=1?1:"boundary")); break;}
    case "weibull": {let k=p.shape,th=p.scale,g1=gamma(1+1/k),g2=gamma(1+2/k),g3=gamma(1+3/k),g4=gamma(1+4/k); m=th*g1; v=th*th*(g2-g1*g1); sk=(g3-3*g1*g2+2*g1**3)/Math.pow(g2-g1*g1,1.5); ex=(g4-4*g1*g3+6*g1*g1*g2-3*g1**4)/(g2-g1*g1)**2-3; med=th*Math.pow(Math.log(2),1/k); mode=k>=1?th*Math.pow((k-1)/k,1/k):0; break;}
    case "lognormal": {let a=p.mu,s=p.sigma; m=Math.exp(a+s*s/2); v=(Math.exp(s*s)-1)*Math.exp(2*a+s*s); sk=(Math.exp(s*s)+2)*Math.sqrt(Math.exp(s*s)-1); ex=Math.exp(4*s*s)+2*Math.exp(3*s*s)+3*Math.exp(2*s*s)-6; med=Math.exp(a); mode=Math.exp(a-s*s); break;}
    case "cauchy": med=p.x0; mode=p.x0; break;
    case "t": {let df=p.df; med=0; mode=0; if(df>1)m=0;if(df>2)v=df/(df-2);if(df>3)sk=0;if(df>4)ex=6/(df-4);break;}
    case "f": {let d1=p.df1,d2=p.df2; if(d2>2)m=d2/(d2-2); if(d2>4)v=2*d2*d2*(d1+d2-2)/(d1*(d2-2)**2*(d2-4)); if(d2>6)sk=(2*d1+d2-2)*Math.sqrt(8*(d2-4))/( (d2-6)*Math.sqrt(d1*(d1+d2-2)) ); if(d2>8)ex=12*(5*d2-22)*(d1+d2-2)+d1*(d2-4)*(d2-6)*(d2-8); break;}
    case "chisq": {let df=p.df; m=df; v=2*df; sk=Math.sqrt(8/df); ex=12/df; med=df*Math.pow(1-2/(9*df),3); mode=Math.max(df-2,0); break;}
    case "logistic": {let a=p.mu,s=p.s; m=a; v=Math.PI**2*s*s/3; sk=0; ex=6/5; med=a; mode=a; break;}
    case "laplace": {let a=p.mu,b=p.b; m=a; v=2*b*b; sk=0; ex=3; med=a; mode=a; break;}
    case "pareto": {let xm=p.xm,a=p.alpha; if(a>1)m=a*xm/(a-1); if(a>2)v=a*xm*xm/((a-1)**2*(a-2)); if(a>3)sk=2*(1+a)*Math.sqrt(a-2)/(a-3)*Math.sqrt(1/a); if(a>4)ex=6*(a**3+a**2-6*a-2)/(a*(a-3)*(a-4)); med=xm*Math.pow(2,1/a); mode=xm; break;}
    case "rayleigh": {let sig=p.sigma; m=sig*Math.sqrt(Math.PI/2); v=(4-Math.PI)*sig*sig/2; sk=2*Math.sqrt(Math.PI)*(Math.PI-3)/(4-Math.PI)**1.5; ex=(6*Math.PI**2-24*Math.PI+16)/(4-Math.PI)**2-3; med=sig*Math.sqrt(2*Math.log(2)); mode=sig; break;}
    case "gumbel": {let a=p.mu,b=p.beta; m=a+0.5772156649*b; v=Math.PI**2*b*b/6; sk=12*Math.sqrt(6)*1.202056903/(Math.PI**3); ex=12/5; med=a-b*Math.log(Math.log(2)); mode=a; break;}
    case "triangular": {let a=p.a,c=p.m,b=p.b; m=(a+b+c)/3; v=(a*a+b*b+c*c-a*b-a*c-b*c)/18; sk=7*Math.sqrt(2)*(a+b-2*c)*(2*a-b-c)*(a-2*b+c)/(5*Math.pow(a*a+b*b+c*c-a*b-a*c-b*c,1.5)); ex=NaN; med=c>= (a+b)/2 ? a+Math.sqrt((b-a)*(c-a)/2) : b-Math.sqrt((b-a)*(b-c)/2); mode=c; break;}
    case "erlang": {let k=Math.round(p.k),l=p.lambda; m=k/l; v=k/(l*l); sk=2/Math.sqrt(k); ex=6/k; med=(k-1/3)/l; mode=(k-1)/l; break;}
    case "invgauss": {let mu=p.mu,la=p.lambda; m=mu; v=mu**3/la; sk=3*Math.sqrt(mu/la); ex=15*mu/la; med=mu*(Math.sqrt(1+9*mu*mu/(4*la*la))-3*mu/(2*la)); mode=mu*(Math.sqrt(1+9*mu*mu/(4*la*la))-3*mu/(2*la)); break;}
    case "fisherz": {m=0;v=1;sk=0;ex=0;med=0;mode=0;break;}
    default: break;
  }
  // Numerical fallback for raw/central moments. This also covers distributions whose simple formulas are not implemented above.
  const range=calcCore(spec.key,0,p).range||[-5,5];
  let lo=range[0],hi=range[1]; if(!Number.isFinite(lo))lo=-10;if(!Number.isFinite(hi))hi=10;if(hi<=lo){lo=-5;hi=5}
  let pts=[], probs=[];
  if(spec.type==="Discrete"){
    let a=Math.ceil(lo),b=Math.floor(hi); if(b-a>5000)b=a+5000;
    for(let x=a;x<=b;x++){let z=calcCore(spec.key,x,p).v;if(Number.isFinite(z)&&z>0){pts.push(x);probs.push(z)}}
  }else{
    let N=500, dx=(hi-lo)/N; for(let i=0;i<=N;i++){let x=lo+i*dx,z=calcCore(spec.key,x,p).v;if(Number.isFinite(z)&&z>=0){pts.push(x);probs.push(z*(i===0||i===N?0.5:1)*dx)}}
  }
  let total=probs.reduce((a,b)=>a+b,0); if(total>0){probs=probs.map(z=>z/total);if(!Number.isFinite(m))m=pts.reduce((a,x,i)=>a+x*probs[i],0);if(!Number.isFinite(v)){let c=m;v=pts.reduce((a,x,i)=>a+(x-c)**2*probs[i],0)}
    let raw=[1,2,3,4].map(k=>pts.reduce((a,x,i)=>a+x**k*probs[i],0));let c2=pts.reduce((a,x,i)=>a+(x-m)**2*probs[i],0),c3=pts.reduce((a,x,i)=>a+(x-m)**3*probs[i],0),c4=pts.reduce((a,x,i)=>a+(x-m)**4*probs[i],0);
    if(!Number.isFinite(sk)&&c2>0)sk=c3/Math.pow(c2,1.5); if(!Number.isFinite(ex)&&c2>0)ex=c4/(c2*c2)-3;
    if(!Number.isFinite(med)){let acc=0;for(let i=0;i<probs.length;i++){acc+=probs[i];if(acc>=.5){med=pts[i];break}}}
    if(!Number.isFinite(mode)){let im=probs.indexOf(Math.max(...probs));mode=pts[im]}
    FAST_MATH=oldFast; return {mean:m,variance:v,sd:Math.sqrt(Math.max(0,v)),median:med,mode,raw,central:[0,c2,c3,c4],skew:sk,excess:ex};
  }
  FAST_MATH=oldFast; return {mean:m,variance:v,sd:Number.isFinite(v)?Math.sqrt(Math.max(0,v)):NaN,median:med,mode,raw:[m,NaN,NaN,NaN],central:[0,v,NaN,NaN],skew:sk,excess:ex};
}
const LAWS={
"Bernoulli":{law:"P(X=x)=p^x(1-p)^{1-x},  x∈{0,1}",support:"0<p<1; X is the success indicator."},
"Binomial":{law:"P(X=x)=C(n,x)p^x(1-p)^{n-x},  x=0,1,…,n",support:"n=1,2,…; 0<p<1."},
"Geometric":{law:"P(X=x)=p(1-p)^{x-1},  x=1,2,…",support:"This site uses the trials-until-first-success parameterization."},
"Negative Binomial":{law:"P(X=x)=C(x+r-1,x)p^r(1-p)^x,  x=0,1,…",support:"X counts failures before the r-th success."},
"Hypergeometric":{law:"P(X=x)=[C(K,x)C(N-K,n-x)]/C(N,n)",support:"N population, K successes, n draws without replacement."},
"Poisson":{law:"P(X=x)=e^{-λ}λ^x/x!,  x=0,1,…",support:"λ>0."},
"Discrete Uniform":{law:"P(X=x)=1/(b-a+1),  x=a,a+1,…,b",support:"a and b are integers with a≤b."},
"Categorical":{law:"P(X=i)=p_i,  i=1,…,k;  Σp_i=1",support:"Each outcome is a category."},
"Multinomial":{law:"P(X_1=x_1,…,X_k=x_k)=n!/(∏x_i!)∏p_i^{x_i}",support:"Σx_i=n and Σp_i=1."},
"Zipf":{law:"P(X=k)=k^{-s}/ζ(s),  k=1,2,…",support:"s>1; ζ(s) is the Riemann zeta function."},
"Logarithmic":{law:"P(X=k)=-p^k/[k ln(1-p)],  k=1,2,…",support:"0<p<1."},
"Skellam":{law:"P(X=k)=e^{-(μ_1+μ_2)}(μ_1/μ_2)^{k/2}I_{|k|}(2√(μ_1μ_2))",support:"Difference of two independent Poisson variables."},
"Discrete Laplace":{law:"P(X=k)=(1-p)/(1+p)·p^{|k|},  k∈ℤ",support:"0<p<1."},
"Beta-Binomial":{law:"P(X=x)=C(n,x)B(x+α,n-x+β)/B(α,β)",support:"x=0,…,n; α,β>0."},
"Dirichlet-Multinomial":{law:"P(X=x)=n!/∏x_i! · Γ(α_0)/Γ(n+α_0) · ∏Γ(x_i+α_i)/Γ(α_i)",support:"α_0=Σα_i and Σx_i=n."},
"Borel":{law:"P(X=k)=e^{-λk}(λk)^{k-1}/k!,  k=1,2,…",support:"0<λ≤1."},
"Yule-Simon":{law:"P(X=k)=ρ·B(k,ρ+1),  k=1,2,…",support:"ρ>0."},
"Benford":{law:"P(D=d)=log_{10}(1+1/d),  d=1,…,9",support:"Leading digit distribution in base 10."},
"Bivariate Poisson":{law:"X=U+W,  Y=V+W with U,V,W independent Poisson",support:"Parameters λ1, λ2, λ3>0."},
"Chinese Restaurant Process":{law:"P(new table at customer i)=α/(α+i-1)",support:"α>0; this defines the seating process rather than a single univariate PMF."},
"Uniform":{law:"f(x)=1/(b-a),  a≤x≤b; 0 otherwise",support:"a<b."},
"Normal":{law:"f(x)=1/(σ√(2π)) exp[-(x-μ)^2/(2σ^2)],  -∞<x<∞",support:"σ>0."},
"Exponential":{law:"f(x)=λe^{-λx},  x≥0; 0 otherwise",support:"λ>0."},
"Gamma":{law:"f(x)=x^{α-1}e^{-x/θ}/[Γ(α)θ^α],  x>0",support:"Shape α>0 and scale θ>0."},
"Beta":{law:"f(x)=x^{α-1}(1-x)^{β-1}/B(α,β),  0<x<1",support:"α,β>0."},
"Weibull":{law:"f(x)=(k/λ)(x/λ)^{k-1}e^{-(x/λ)^k},  x≥0",support:"Shape k>0, scale λ>0."},
"Lognormal":{law:"f(x)=1/(xσ√(2π)) exp[-(ln x-μ)^2/(2σ^2)],  x>0",support:"σ>0; ln(X)~N(μ,σ²)."},
"Cauchy":{law:"f(x)=1/[πγ(1+((x-x_0)/γ)^2)],  -∞<x<∞",support:"γ>0."},
"Student's t":{law:"f(x)=Γ((ν+1)/2)/[√(νπ)Γ(ν/2)]·(1+x²/ν)^{-(ν+1)/2}",support:"ν>0."},
"F":{law:"f(x)=((d_1x)^{d_1}d_2^{d_2}/(d_1x+d_2)^{d_1+d_2})^{1/2}/[xB(d_1/2,d_2/2)]",support:"x>0; d_1,d_2>0."},
"Chi-Square":{law:"f(x)=x^{ν/2-1}e^{-x/2}/[2^{ν/2}Γ(ν/2)],  x>0",support:"ν>0 degrees of freedom."},
"Logistic":{law:"f(x)=e^{-(x-μ)/s}/[s(1+e^{-(x-μ)/s})²]",support:"s>0."},
"Laplace":{law:"f(x)=exp(-|x-μ|/b)/(2b)",support:"b>0."},
"Pareto":{law:"f(x)=αx_m^α/x^{α+1},  x≥x_m",support:"α>0, x_m>0."},
"Rayleigh":{law:"f(x)=xe^{-x²/(2σ²)}/σ²,  x≥0",support:"σ>0."},
"Gumbel":{law:"f(x)=exp[-(z+e^{-z})]/β,  z=(x-μ)/β",support:"β>0; maximum-type Gumbel."},
"Triangular":{law:"f(x)=2(x-a)/[(b-a)(m-a)] for a≤x≤m; 2(b-x)/[(b-a)(b-m)] for m≤x≤b",support:"a≤m≤b."},
"Erlang":{law:"f(x)=λ^k x^{k-1}e^{-λx}/(k-1)!,  x≥0",support:"k is a positive integer; λ>0."},
"Inverse Gaussian":{law:"f(x)=√[λ/(2πx³)] exp[-λ(x-μ)²/(2μ²x)],  x>0",support:"μ>0, λ>0."},
"Fisher's z":{law:"z=atanh(r)=1/2 ln[(1+r)/(1-r)]",support:"For a sample correlation r, Fisher's transform is approximately N(atanh(ρ), 1/(n-3)) under standard conditions."}
};
function calculateDist(){let spec=distSpec(),p=getParams(),x=Number(document.getElementById("xval")?.value);if(!Number.isFinite(x))x=spec.type==="Discrete"?0:(p.mu??p.a??0);let r=calcCore(spec.key,x,p);document.getElementById("pmf").textContent=fmt(r.v);document.getElementById("cdf").textContent=fmt(r.c);let M=numericMoments(spec,p);document.getElementById("mean").textContent=fmt(M.mean);document.getElementById("variance").textContent=fmt(M.variance);document.getElementById("median").textContent=fmt(M.median);document.getElementById("mode").textContent=typeof M.mode==="string"?M.mode:fmt(M.mode);document.getElementById("raw1").textContent=fmt(M.raw[0]);document.getElementById("raw2").textContent=fmt(M.raw[1]);document.getElementById("raw3").textContent=fmt(M.raw[2]);document.getElementById("raw4").textContent=fmt(M.raw[3]);document.getElementById("central1").textContent=fmt(M.central[0]);document.getElementById("central2").textContent=fmt(M.central[1]);document.getElementById("central3").textContent=fmt(M.central[2]);document.getElementById("central4").textContent=fmt(M.central[3]);document.getElementById("skewness").textContent=fmt(M.skew);document.getElementById("kurtosis").textContent=fmt(Number.isFinite(M.excess)?M.excess+3:NaN);document.getElementById("excessKurtosis").textContent=fmt(M.excess);document.getElementById("sd").textContent=fmt(M.sd);drawPlot(spec,p,r.range)}
function setupDist(){let spec=distSpec(),box=document.getElementById("fields");if(!box)return;document.getElementById("distTitle").textContent=spec.name;document.getElementById("typeTitle").textContent=spec.type+" distribution";const L=LAWS[spec.name]||{law:"Law not available",support:"Please verify the parameterization before using this distribution."};document.getElementById("lawBox").textContent=L.law;document.getElementById("lawSupport").textContent=L.support;let labels=spec.params.split(",");box.innerHTML=labels.map(p=>`<div class="field"><label>${p}</label><input data-p="${p}" value="${defaults[p]??1}"></div>`).join("")+`<div class="field"><label>x</label><input id="xval" value="${spec.type==="Discrete"?1:0}"></div>`;document.getElementById("calcBtn").onclick=calculateDist;document.getElementById("resetBtn").onclick=()=>setupDist();document.getElementById("note").textContent=spec.type==="Discrete"?"PMF, CDF, mean, median, mode, first four raw moments, first four central moments, skewness and excess kurtosis are shown where defined.":"PDF, CDF, mean, median, mode, first four raw moments, first four central moments, skewness and excess kurtosis are shown where defined.";calculateDist()}
function drawPlot(spec,p,range){const oldFast=FAST_MATH; FAST_MATH=true;let c=document.getElementById("plot"),ctx=c.getContext("2d"),W=c.width,H=c.height;ctx.clearRect(0,0,W,H);let lo=range[0],hi=range[1];if(!Number.isFinite(lo)||!Number.isFinite(hi)||lo===hi){lo=-5;hi=5}let pad=45;ctx.strokeStyle="#9aa9bc";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(pad,H-pad);ctx.lineTo(W-pad,H-pad);ctx.moveTo(pad,20);ctx.lineTo(pad,H-pad);ctx.stroke();let vals=[];for(let i=0;i<=300;i++){let x=lo+(hi-lo)*i/300;let r=calcCore(spec.key,x,p);vals.push([x,Number.isFinite(r.v)?Math.max(0,r.v):0])}let ymax=Math.max(...vals.map(v=>v[1]),1e-8)*1.12;ctx.strokeStyle="#2563eb";ctx.lineWidth=3;ctx.beginPath();vals.forEach(([x,y],i)=>{let px=pad+(x-lo)/(hi-lo)*(W-2*pad),py=H-pad-y/ymax*(H-55);if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py)});ctx.stroke();ctx.fillStyle="#526176";ctx.font="14px Segoe UI";ctx.fillText(lo.toPrecision(4),pad,H-18);ctx.fillText(hi.toPrecision(4),W-pad-35,H-18);ctx.fillText("x",W-25,H-pad+5);ctx.fillText(spec.type==="Discrete"?"PMF":"PDF",pad+10,28); FAST_MATH=oldFast}
if(location.pathname.endsWith("distribution.html"))setupDist();
if(document.getElementById("distGrid")&&document.getElementById("search")){
function filterD(){const q=document.getElementById("search").value.toLowerCase(),t=document.getElementById("type").value;document.getElementById("distGrid").innerHTML=D.filter(d=>(t==="all"||d.type===t)&&d.name.toLowerCase().includes(q)).map(d=>`<a class="dist-card" href="distribution.html?name=${encodeURIComponent(d.name)}"><h4>${d.name}</h4><small>${d.type} distribution</small></a>`).join("")}
document.getElementById("search").addEventListener("input",filterD);document.getElementById("type").addEventListener("change",filterD);
}


/* ---------- Bivariate Analysis ---------- */
function biTokens(v){return String(v||'').trim().split(/[\s,;\n\t]+/).filter(Boolean)}
function biNum(v){const a=biTokens(v);return a.length>0&&a.every(z=>Number.isFinite(Number(z)))}
function biScaleGuess(a){
 const vals=[...new Set(a.map(v=>String(v).trim()))], low=vals.map(v=>v.toLowerCase());
 if(vals.length===2) return {type:'Nominal',confidence:'high',reason:'Two categories detected; binary variables are nominal unless the order is explicitly meaningful.'};
 const orders=[['very poor','poor','fair','average','good','very good','excellent'],['strongly disagree','disagree','neutral','agree','strongly agree'],['never','rarely','sometimes','often','always'],['low','medium','high'],['small','medium','large'],['primary','secondary','higher secondary','undergraduate','graduate','postgraduate'],['freshman','sophomore','junior','senior'],['first','second','third','fourth','fifth']];
 for(const seq of orders){if(low.every(v=>seq.includes(v))){const pos=low.map(v=>seq.indexOf(v)); if(new Set(pos).size===vals.length) return {type:'Ordinal',confidence:'high',reason:'Recognized natural order in the category labels.'};}}
 if(vals.every(v=>/^\d+$/.test(v))){return {type:'Ordinal',confidence:'low',reason:'Numeric codes may represent ordered categories; please confirm.'};}
 return {type:'Nominal',confidence:'low',reason:'No reliable natural order could be inferred; please confirm if these categories are ordinal.'};
}
function biOrdinalScores(a,order){const vals=[...new Set(a.map(v=>String(v)))];let map={};if(order&&order.length){order.forEach((v,i)=>map[String(v)]=i+1)}else{[...vals].sort().forEach((v,i)=>map[v]=i+1)}return a.map(v=>map[String(v)]);}
function biGammaSomers(x,y,xtype,ytype){
 const rx=biOrdinalScores(x,xtype==='Ordinal'?x:null), ry=biOrdinalScores(y,ytype==='Ordinal'?y:null); let C=0,D=0,Tx=0,Ty=0;
 for(let i=0;i<rx.length;i++) for(let j=i+1;j<rx.length;j++){const dx=Math.sign(rx[j]-rx[i]),dy=Math.sign(ry[j]-ry[i]); if(dx===0&&dy===0)continue; if(dx===0)Tx++; else if(dy===0)Ty++; else if(dx===dy)C++; else D++;}
 return {C,D,Tx,Ty,gamma:(C+D)?(C-D)/(C+D):NaN,somers:(C+D+Ty)?(C-D)/(C+D+Ty):NaN};
}
function biNumeric(v){return biTokens(v).map(Number)}
function biFmt(x){return Number.isFinite(x)?(Math.abs(x)<1e-10?'0':x.toFixed(5)):'—'}
function biMean(a){return a.reduce((s,x)=>s+x,0)/a.length}
function biVariance(a){const m=biMean(a);return a.length>1?a.reduce((s,x)=>s+(x-m)**2,0)/(a.length-1):NaN}
function biPearson(x,y){const mx=biMean(x),my=biMean(y);let c=0,sx=0,sy=0;for(let i=0;i<x.length;i++){let dx=x[i]-mx,dy=y[i]-my;c+=dx*dy;sx+=dx*dx;sy+=dy*dy}return c/Math.sqrt(sx*sy)}
function biRank(a){const idx=a.map((v,i)=>[v,i]).sort((u,v)=>u[0]-v[0]),r=Array(a.length);let i=0;while(i<a.length){let j=i;while(j+1<a.length&&idx[j+1][0]===idx[i][0])j++;const av=(i+j+2)/2;for(let k=i;k<=j;k++)r[idx[k][1]]=av;i=j+1}return r}
function biSpearman(x,y){return biPearson(biRank(x),biRank(y))}
function biKendall(x,y){let C=0,D=0,Tx=0,Ty=0;for(let i=0;i<x.length;i++)for(let j=i+1;j<x.length;j++){const dx=Math.sign(x[j]-x[i]),dy=Math.sign(y[j]-y[i]);if(dx===0&&dy===0)continue;if(dx===0)Tx++;else if(dy===0)Ty++;else if(dx===dy)C++;else D++;}const den=Math.sqrt((C+D+Tx)*(C+D+Ty));return den? (C-D)/den:NaN}
function biRegression(x,y){const mx=biMean(x),my=biMean(y);let sxx=0,sxy=0;for(let i=0;i<x.length;i++){sxx+=(x[i]-mx)**2;sxy+=(x[i]-mx)*(y[i]-my)}const b=sxy/sxx,a=my-b*mx,r=biPearson(x,y);return{a,b,r,r2:r*r,sxx}}
function biPartial(x,y,z){const rxy=biPearson(x,y),rxz=biPearson(x,z),ryz=biPearson(y,z);const den=Math.sqrt((1-rxz**2)*(1-ryz**2));return{r:(rxy-rxz*ryz)/den,rxy,rxz,ryz}}
function biPFromT(t,df){if(!Number.isFinite(t)||df<=0)return NaN;const z=Math.abs(t);if(df>100)return 2*(1-(0.5*(1+erf(z/Math.sqrt(2)))));const approx=2*(1-(0.5*(1+erf(z/Math.sqrt(2)))));return Math.min(1,approx*Math.sqrt((df+1)/(df+0.5)))}
function biCorrelationP(r,n){if(!Number.isFinite(r)||Math.abs(r)>=1||n<3)return Math.abs(r)>=1?0:NaN;const t=r*Math.sqrt((n-2)/(1-r*r));return biPFromT(t,n-2)}
function biGroups(a){const m=new Map();a.forEach(v=>m.set(v,(m.get(v)||0)+1));return [...m.entries()]}
function biFreqTable(a,name){const g=biGroups(a),N=a.length;return `<div class="bi-section"><h4>Frequency Table — ${name}</h4><table class="bi-table"><thead><tr><th>Value / Category</th><th>Frequency</th><th>Relative Frequency</th><th>Percentage</th></tr></thead><tbody>${g.map(([v,c])=>`<tr><td>${v}</td><td>${c}</td><td>${biFmt(c/N)}</td><td>${biFmt(c*100/N)}%</td></tr>`).join('')}</tbody></table></div>`}
function biScatter(x,y,n1,n2,reg){let W=760,H=430,pad=58,xmin=Math.min(...x),xmax=Math.max(...x),ymin=Math.min(...y),ymax=Math.max(...y);if(xmax===xmin){xmin--;xmax++}if(ymax===ymin){ymin--;ymax++}const sx=v=>pad+(v-xmin)/(xmax-xmin)*(W-2*pad),sy=v=>H-pad-(v-ymin)/(ymax-ymin)*(H-2*pad);let svg=`<svg viewBox="0 0 ${W} ${H}" role="img"><line x1="${pad}" y1="${H-pad}" x2="${W-pad}" y2="${H-pad}" class="bi-axis"/><line x1="${pad}" y1="${pad}" x2="${pad}" y2="${H-pad}" class="bi-axis"/>`;x.forEach((v,i)=>svg+=`<circle cx="${sx(v)}" cy="${sy(y[i])}" r="5" class="bi-point"><title>${n1}: ${v}, ${n2}: ${y[i]}</title></circle>`);if(reg){const xa=xmin,xb=xmax;svg+=`<line x1="${sx(xa)}" y1="${sy(reg.a+reg.b*xa)}" x2="${sx(xb)}" y2="${sy(reg.a+reg.b*xb)}" class="bi-regline"/>`}svg+=`<text x="${W/2}" y="${H-10}" text-anchor="middle" class="bi-label">${n1}</text><text x="16" y="${H/2}" text-anchor="middle" transform="rotate(-90 16 ${H/2})" class="bi-label">${n2}</text></svg>`;return `<div class="bi-section"><h4>Scatter Plot</h4><div class="bi-chart-wrap">${svg}</div></div>`}
function biFormula(title,latex){return `<details class="bi-formula" open><summary>${title} — Formula / Law</summary><div class="bi-formula-body"><div class="formula-box">\\(${latex}\\)</div></div></details>`}
function biAutoComment(title,value,body){
 const v=typeof value==='number'?value:parseFloat(String(value));
 if(/Pearson|Spearman|Kendall|Gamma|Somers|Point-Biserial|Phi|Cramer|Partial|Multiple|Canonical/i.test(title)&&Number.isFinite(v)){
   const a=Math.abs(v); const strength=a<0.2?'very weak':a<0.4?'weak':a<0.6?'moderate':a<0.8?'strong':'very strong';
   const dir=v>0?'positive':v<0?'negative':'no'; return `The result indicates a <b>${strength} ${dir} association</b>. Association does not by itself imply causation.`;
 }
 if(/Chi-square|Fisher|t-test|Welch|Mann|Wilcoxon/i.test(title)){
   const m=String(body||'').match(/p-value = <b>([^<]+)/i); const p=m?parseFloat(m[1]):NaN;
   if(Number.isFinite(p)) return p<0.05?'<b>Statistically significant at the 5% level.</b> Reject H₀.':'<b>Not statistically significant at the 5% level.</b> Fail to reject H₀.';
 }
 if(/Regression/i.test(title)) return 'This model describes the estimated relationship between the predictor and response; the coefficient shows the expected change in the response for a one-unit predictor change.';
 if(/R²|Determination/i.test(title)) return 'R² is the proportion of variation in the response explained by the fitted linear relationship.';
 if(/Frequency Table/i.test(title)) return 'The table summarizes how often each observed value/category occurs.';
 if(/Scatter Plot/i.test(title)) return 'Use the plot to assess direction, strength, linearity, outliers, and unusual patterns before relying on correlation or regression.';
 if(/Cross-tabulation/i.test(title)) return 'The table summarizes the joint distribution of the two categorical variables and their cell counts.';
 if(/Odds Ratio/i.test(title)) return 'OR > 1 suggests higher odds in the first exposure/group; OR < 1 suggests lower odds. The reference coding matters.';
 if(/Relative Risk/i.test(title)) return 'RR > 1 suggests higher risk in the first group; RR < 1 suggests lower risk. The reference group matters.';
 return 'Review the value, formula, and assumptions before drawing a research conclusion.';
}
function biResult(title,value,body,formula,comment){const el=document.getElementById("biSelectedResult");if(!el)return;const c=comment||biAutoComment(title,value,body);el.innerHTML=`<div class="bi-result-card"><h3>${title}</h3><div class="bi-result-value">${value}</div>${body||''}<div class="bi-comment"><b>Comment:</b> ${c}</div>${biFormula("Formula / Law",formula)}</div>`;if(window.MathJax?.typesetPromise)window.MathJax.typesetPromise([el]).catch(()=>{});}
function biIsBinary(a){const u=[...new Set(a.map(v=>String(v)))];return u.length===2;}
function biGroups2(a){const u=[...new Set(a.map(v=>String(v)))];return u.length===2?u:null;}
function biContingency(a,b){const ra=[...new Set(a.map(v=>String(v)))], cb=[...new Set(b.map(v=>String(v)))];const rows=ra.map(r=>cb.map(c=>a.reduce((s,v,i)=>s+(String(v)===r&&String(b[i])===c?1:0),0)));return{ra,cb,rows};}
function biChiSquare(a,b){const q=biContingency(a,b),R=q.rows.length,C=q.cb.length,N=a.length,row=q.rows.map(r=>r.reduce((s,v)=>s+v,0)),col=q.cb.map((_,j)=>q.rows.reduce((s,r)=>s+r[j],0));let chi=0;for(let i=0;i<R;i++)for(let j=0;j<C;j++){const e=row[i]*col[j]/N;if(e>0)chi+=(q.rows[i][j]-e)**2/e;}return{chi,df:(R-1)*(C-1),q};}
function regLowerGamma(s,x){if(x<=0)return 0;let sum=1/s,term=sum;for(let n=1;n<100;n++){term*=x/(s+n);sum+=term;if(Math.abs(term)<Math.abs(sum)*1e-12)break;}return Math.exp(-x+s*Math.log(x)-logGamma(s))*sum;}
function regUpperGamma(s,x){if(x<=0)return 1; if(x<s+1)return 1-regLowerGamma(s,x);let b=x+1-s,c=1e-300,d=1/b,h=d;for(let i=1;i<200;i++){let an=-i*(i-s),bb=b+2*i;d=an*d+bb;if(Math.abs(d)<1e-300)d=1e-300;c=bb+an/c;if(Math.abs(c)<1e-300)c=1e-300;d=1/d;const del=d*c;h*=del;if(Math.abs(del-1)<1e-12)break;}return Math.exp(-x+s*Math.log(x)-logGamma(s))*h;}
function biChiP(chi,df){return Number.isFinite(chi)&&df>0?regUpperGamma(df/2,chi/2):NaN;}
function biTwoGroupStats(a,b){const u=[...new Set(a.map(v=>String(v)))];if(u.length!==2)return null;const g1=[],g2=[];a.forEach((v,i)=>{(String(v)===u[0]?g1:g2).push(Number(b[i]))});return{u,g1,g2};}
function biTTest(g1,g2,welch=false){const n1=g1.length,n2=g2.length,m1=biMean(g1),m2=biMean(g2),v1=g1.reduce((s,x)=>s+(x-m1)**2,0)/(n1-1),v2=g2.reduce((s,x)=>s+(x-m2)**2,0)/(n2-1);if(welch){const se=Math.sqrt(v1/n1+v2/n2),t=(m1-m2)/se,df=(v1/n1+v2/n2)**2/((v1/n1)**2/(n1-1)+(v2/n2)**2/(n2-1));return{t,df,p:biPFromT(t,df),m1,m2,v1,v2};}const sp2=((n1-1)*v1+(n2-1)*v2)/(n1+n2-2),se=Math.sqrt(sp2*(1/n1+1/n2)),t=(m1-m2)/se,df=n1+n2-2;return{t,df,p:biPFromT(t,df),m1,m2,v1,v2,sp2};}
function biPaired(a,b){const d=a.map((v,i)=>Number(v)-Number(b[i]));const md=biMean(d),sd=Math.sqrt(d.reduce((s,x)=>s+(x-md)**2,0)/(d.length-1)),t=md/(sd/Math.sqrt(d.length)),df=d.length-1;return{t,df,p:biPFromT(t,df),md,sd};}
function biMannWhitney(g1,g2){const all=g1.map(v=>({v:Number(v),g:1})).concat(g2.map(v=>({v:Number(v),g:2}))).sort((a,b)=>a.v-b.v);let i=0,r1=0,ranks=[];while(i<all.length){let j=i+1;while(j<all.length&&all[j].v===all[i].v)j++;const r=(i+1+j)/2;for(let k=i;k<j;k++)ranks[k]=r;i=j;}all.forEach((o,k)=>{if(o.g===1)r1+=ranks[k]});const n1=g1.length,n2=g2.length,U1=r1-n1*(n1+1)/2,U2=n1*n2-U1,U=Math.min(U1,U2),mu=n1*n2/2,sd=Math.sqrt(n1*n2*(n1+n2+1)/12),z=(U-mu+0.5)/sd,p=biPFromT(z,1e6);return{U,z,p,n1,n2};}
function biWilcoxon(a,b){const d=a.map((v,i)=>Number(v)-Number(b[i])).filter(v=>v!==0);const abs=d.map(v=>Math.abs(v)).sort((x,y)=>x-y);let Wp=0,Wm=0;for(const v of d){let r=abs.indexOf(Math.abs(v))+1;if(v>0)Wp+=r;else Wm+=r;}const W=Math.min(Wp,Wm),n=d.length,mu=n*(n+1)/4,sd=Math.sqrt(n*(n+1)*(2*n+1)/24),z=(W-mu+0.5)/sd,p=biPFromT(z,1e6);return{W,z,p,n};}
function biORRR(a,b){const q=biContingency(a,b);if(q.rows.length!==2||q.cb.length!==2)return null;const A=q.rows[0][0],B=q.rows[0][1],C=q.rows[1][0],D=q.rows[1][1];return{A,B,C,D,or:(A*D)/(B*C||1),rr:(A/(A+B||1))/(C/(C+D||1))};}
function biANOVA(groups){const all=groups.flat(),N=all.length,k=groups.length,gm=biMean(all);let ssb=0,ssw=0;groups.forEach(g=>{const m=biMean(g);ssb+=g.length*(m-gm)**2;ssw+=g.reduce((s,x)=>s+(x-m)**2,0)});const df1=k-1,df2=N-k,msb=ssb/df1,mse=ssw/df2,F=msb/mse;return{ssb,ssw,df1,df2,msb,mse,F};}
function biApplicableOptions(t1,t2,tok1,tok2,t3,tok3,s1,s2){
 let o=[]; const add=(id,name,desc)=>o.push(`<button type="button" class="bi-analysis-option" data-bi="${id}"><b>${name}</b><small>${desc}</small></button>`);
 const n1=document.getElementById('biName1').value,n2=document.getElementById('biName2').value;
 if(t1==='Numerical'&&t2==='Numerical'){
   add('pearson',"Pearson's Product-Moment Correlation","Linear association"); add('spearman',"Spearman's Rank Correlation","Rank/monotonic association"); add('kendall',"Kendall's Tau","Rank association");
   add('regression','Simple Linear Regression','Model one numerical variable from the other'); add('r2','Coefficient of Determination (R²)','Explained variation'); add('scatter','Scatter Plot','Visual relationship'); add('freq1','Frequency Table — '+n1,'Frequency distribution'); add('freq2','Frequency Table — '+n2,'Frequency distribution');
   if(t3==='Numerical') add('partial','Partial Correlation','Control for '+document.getElementById('biName3').value);
 } else if(t1==='Categorical'&&t2==='Categorical'){
   add('crosstab','Cross-tabulation','Contingency table'); add('chisq','Chi-square Test of Independence','Nominal association / independence'); add('fisher','Fisher’s Exact Test','Exact test for 2×2 tables'); add('cramerv',"Cramer's V",'Association strength');
   if(s1==='Nominal'&&s2==='Nominal'&&biIsBinary(tok1)&&biIsBinary(tok2)){add('phi','Phi Coefficient','Binary × binary association');add('oddsratio','Odds Ratio','2×2 effect size');add('rr','Relative Risk','2×2 risk ratio');}
   if(s1==='Ordinal'&&s2==='Ordinal'){add('spearman',"Spearman's Rank Correlation","Ordinal monotonic association");add('kendall',"Kendall's Tau","Ordinal rank association");add('gamma',"Goodman–Kruskal's Gamma","Ordinal association");add('somers',"Somers' D","Directional ordinal association");}
   add('freq1','Frequency Table — '+n1,'Frequency distribution'); add('freq2','Frequency Table — '+n2,'Frequency distribution');
 } else {
   const cat=t1==='Categorical'?tok1:tok2;
   if(biIsBinary(cat)){add('pointbiserial','Point-Biserial Correlation','Binary + numerical');add('ttest','Independent Samples t-test','Two-group mean comparison');add('welch','Welch’s t-test','Unequal-variance two-group comparison');add('mannwhitney','Mann–Whitney U Test','Non-parametric two-group comparison');}
   add('freq1','Frequency Table — '+n1,'Frequency distribution'); add('freq2','Frequency Table — '+n2,'Frequency distribution');
 }
 return o.join('');
}
function biBindOptions(){document.querySelectorAll('.bi-analysis-option').forEach(b=>b.onclick=()=>biShowTool(b.dataset.bi))}
function biShowTool(id){const q=window.BI_CURRENT;if(!q)return;const {x,y,z,n1,n2,n3,t1,t2}=q;
 if(id==='pearson'){const r=biPearson(x,y),p=biCorrelationP(r,x.length);biResult("Pearson's Product-Moment Correlation",biFmt(r),`<p class="bi-p">p-value = <b>${biFmt(p)}</b></p><p class="bi-p">${p<0.05?'Significant at the 5% level.':'Not significant at the 5% level.'}</p>`,`r=\\frac{n\\sum xy-(\\sum x)(\\sum y)}{\\sqrt{[n\\sum x^2-(\\sum x)^2][n\\sum y^2-(\\sum y)^2]}}`);}
 else if(id==='spearman'){const r=biSpearman(x,y);biResult("Spearman's Rank Correlation (ρ)",biFmt(r),`<p class="bi-p">Rank differences are used to measure monotonic association.</p>`,`\\rho=1-\\frac{6\\sum d^2}{n(n^2-1)}`);}
 else if(id==='kendall'){const r=biKendall(x,y);biResult("Kendall's Tau-b",biFmt(r),`<p class="bi-p">Based on concordant and discordant pairs, with tie adjustment.</p>`,`\\tau_b=\\frac{C-D}{\\sqrt{(C+D+T_x)(C+D+T_y)}}`);}
 else if(id==='regression'){const g=biRegression(x,y);biResult("Simple Linear Regression",`ŷ = ${biFmt(g.a)} + (${biFmt(g.b)})X`,`<div class="bi-regression-grid"><div><span>Intercept (b₀)</span><strong>${biFmt(g.a)}</strong></div><div><span>Regression coefficient / slope (b₁)</span><strong>${biFmt(g.b)}</strong></div><div><span>R</span><strong>${biFmt(g.r)}</strong></div><div><span>R²</span><strong>${biFmt(g.r2)}</strong></div></div><p class="bi-p">Model: <b>ŷ = b₀ + b₁X</b></p>`,`\\hat{y}=b_0+b_1x,\\quad b_1=\\frac{\\sum(x-\\bar{x})(y-\\bar{y})}{\\sum(x-\\bar{x})^2},\\quad b_0=\\bar{y}-b_1\\bar{x}`);}
 else if(id==='r2'){const r=biPearson(x,y);biResult("Coefficient of Determination (R²)",biFmt(r*r),`<p class="bi-p">${biFmt(r*r*100)}% of the variation in Y is associated with the linear model using X.</p>`,`R^2=r^2`);}
 else if(id==='scatter'){biResult("Scatter Plot","",biScatter(x,y,n1,n2,biRegression(x,y)),`\\text{Plot of }(X,Y)\\text{ observations}`);}
 else if(id==='freq1'){biResult("Frequency Table — "+n1,"",biFreqTable(x,n1),`\\text{Relative frequency}=\\frac{f}{n},\\quad\\text{Percentage}=\\frac{f}{n}\\times100`);}
 else if(id==='freq2'){biResult("Frequency Table — "+n2,"",biFreqTable(y,n2),`\\text{Relative frequency}=\\frac{f}{n},\\quad\\text{Percentage}=\\frac{f}{n}\\times100`);}
 else if(id==='partial'&&z){const g=biPartial(x,y,z);biResult("Partial Correlation",biFmt(g.r),`<div class="bi-regression-grid"><div><span>rXY</span><strong>${biFmt(g.rxy)}</strong></div><div><span>rXZ</span><strong>${biFmt(g.rxz)}</strong></div><div><span>rYZ</span><strong>${biFmt(g.ryz)}</strong></div></div>`,`r_{XY\\cdot Z}=\\frac{r_{XY}-r_{XZ}r_{YZ}}{\\sqrt{(1-r_{XZ}^2)(1-r_{YZ}^2)}}`);}
 else if(id==='pairedttest'){const r=biPaired(x,y);biResult('Paired Samples t-test',biFmt(r.t),`<p class="bi-p">df = <b>${r.df}</b>, p-value = <b>${biFmt(r.p)}</b>, mean difference = <b>${biFmt(r.md)}</b></p>`,'t=\\frac{\\bar d}{s_d/\\sqrt n}');}
 else if(id==='wilcoxon'){const r=biWilcoxon(x,y);biResult('Wilcoxon Signed-Rank Test',biFmt(r.W),`<p class="bi-p">z = <b>${biFmt(r.z)}</b>, approximate p-value = <b>${biFmt(r.p)}</b>, non-zero pairs = <b>${r.n}</b></p>`,'W=\\min(W^+,W^-)');}
 else if(id==='pointbiserial'){biResult("Point-Biserial Correlation","Applicable only when one variable is truly binary and the other is numerical.","<p class='bi-p'>Use a binary variable such as 0/1 or Yes/No.</p>","r_{pb}=\\frac{\\bar X_1-\\bar X_0}{s_X}\\sqrt{pq}");}
 else if(id==='crosstab'){const q=biContingency(x,y);let html='<table class="bi-table"><thead><tr><th></th>'+q.cb.map(c=>`<th>${c}</th>`).join('')+'<th>Total</th></tr></thead><tbody>'+q.rows.map((r,i)=>`<tr><th>${q.ra[i]}</th>${r.map(v=>`<td>${v}</td>`).join('')}<td>${r.reduce((s,v)=>s+v,0)}</td></tr>`).join('')+'</tbody></table>';biResult('Cross-tabulation','',html,'E_{ij}=\\frac{(Row_i)(Column_j)}{N}');}
 else if(id==='chisq'){const g=biChiSquare(x,y);const p=biChiP(g.chi,g.df);biResult('Chi-square Test of Independence',biFmt(g.chi),`<p class="bi-p">df = <b>${g.df}</b> &nbsp; p-value = <b>${biFmt(p)}</b></p><p class="bi-p">${p<0.05?'Significant association at the 5% level.':'No significant association at the 5% level.'}</p>`,'\\chi^2=\\sum\\frac{(O-E)^2}{E},\\quad E=\\frac{(Row\\ Total)(Column\\ Total)}{Grand\\ Total}');}
 else if(id==='fisher'){const q=biContingency(x,y);if(q.rows.length===2&&q.cb.length===2){const A=q.rows[0][0],B=q.rows[0][1],C=q.rows[1][0],D=q.rows[1][1],n=A+B+C+D;const logp=(logChoose(A+B,A)+logChoose(C+D,C)-logChoose(n,A+C));biResult('Fisher’s Exact Test',`OR = ${biFmt((A*D)/(B*C||1))}`,`<p class="bi-p">2×2 table detected. Exact hypergeometric probability is used for the observed table; for a full two-sided exact p-value, software implementation is recommended.</p>`,'P=\\frac{(A+B)!(C+D)!(A+C)!(B+D)!}{A!B!C!D!N!}');}else biResult('Fisher’s Exact Test','Not applicable','Requires a 2×2 contingency table.','P=\\frac{(A+B)!(C+D)!(A+C)!(B+D)!}{A!B!C!D!N!}');}
 else if(id==='cramerv'){const g=biChiSquare(x,y),k=Math.min(g.q.rows.length,g.q.cb.length);biResult("Cramer's V",biFmt(Math.sqrt(g.chi/(x.length*(k-1)))),`<p class="bi-p">Based on the chi-square statistic and table dimensions.</p>`,'V=\\sqrt{\\frac{\\chi^2}{N(k-1)}}');}
 else if(id==='phi'){const g=biChiSquare(x,y);biResult('Phi Coefficient',biFmt(Math.sqrt(g.chi/x.length)),`<p class="bi-p">For a 2×2 table.</p>`,`\\phi=\\sqrt{\\frac{\\chi^2}{N}}`);}
 else if(id==='oddsratio'||id==='rr'){const g=biORRR(x,y);if(g)biResult(id==='oddsratio'?'Odds Ratio':'Relative Risk',biFmt(id==='oddsratio'?g.or:g.rr),`<p class="bi-p">2×2 table counts: A=${g.A}, B=${g.B}, C=${g.C}, D=${g.D}</p>`,id==='oddsratio'?'OR=\\frac{AD}{BC}':'RR=\\frac{A/(A+B)}{C/(C+D)}');}
 else if(id==='ttest'||id==='welch'||id==='mannwhitney'){const cat=t1==='Categorical'?x:y,num=t1==='Numerical'?x:y,g=biTwoGroupStats(cat,num);if(!g){biResult(id==='ttest'?'Independent Samples t-test':id==='welch'?"Welch’s t-test":'Mann–Whitney U Test','Not applicable','The grouping variable must contain exactly two groups.','');}else if(id==='mannwhitney'){const r=biMannWhitney(g.g1,g.g2);biResult('Mann–Whitney U Test',biFmt(r.U),`<p class="bi-p">z = <b>${biFmt(r.z)}</b>, approximate p-value = <b>${biFmt(r.p)}</b></p>`,'U=R_1-\\frac{n_1(n_1+1)}{2}');}else{const r=biTTest(g.g1,g.g2,id==='welch');biResult(id==='welch'?"Welch’s t-test":'Independent Samples t-test',biFmt(r.t),`<p class="bi-p">df = <b>${biFmt(r.df)}</b>, p-value = <b>${biFmt(r.p)}</b></p><p class="bi-p">Group means: ${biFmt(r.m1)} and ${biFmt(r.m2)}</p>`,id==='welch'?'t=\\frac{\\bar X_1-\\bar X_2}{\\sqrt{s_1^2/n_1+s_2^2/n_2}}':'t=\\frac{\\bar X_1-\\bar X_2}{s_p\\sqrt{1/n_1+1/n_2}}');}}
 else if(id==='pointbiserial'){const cat=t1==='Categorical'?x:y,num=t1==='Numerical'?x:y,g=biTwoGroupStats(cat,num);if(g){const all=num,m=biMean(all),sd=Math.sqrt(all.reduce((s,v)=>s+(v-m)**2,0)/(all.length-1)),r=((biMean(g.g1)-biMean(g.g2))/sd)*Math.sqrt(g.g1.length*g.g2.length/(all.length**2));biResult('Point-Biserial Correlation',biFmt(r),`<p class="bi-p">Two binary groups detected.</p>`,'r_{pb}=\\frac{\\bar X_1-\\bar X_0}{s_X}\\sqrt{pq}');}}
 else if(id==='gamma'||id==='somers'){const g=biGammaSomers(x,y,t1==='Categorical'?window.BI_CURRENT.s1:'Numerical',t2==='Categorical'?window.BI_CURRENT.s2:'Numerical');biResult(id==='gamma'?"Goodman–Kruskal's Gamma":"Somers' D",biFmt(id==='gamma'?g.gamma:g.somers),`<p class="bi-p">Concordant pairs = <b>${g.C}</b>, discordant pairs = <b>${g.D}</b>, ties on X = <b>${g.Tx}</b>, ties on Y = <b>${g.Ty}</b>.</p>`,id==='gamma'?"\\gamma=\\frac{C-D}{C+D}":"D_{Y\\mid X}=\\frac{C-D}{C+D+T_Y}");}
}
window.biSetType=function(which,type){window.BI_TYPES=window.BI_TYPES||{};window.BI_TYPES[which]=type;window.runBivariate();};
window.runBivariate=function(){
 const n1=document.getElementById('biName1')?.value.trim()||'Variable 1',n2=document.getElementById('biName2')?.value.trim()||'Variable 2',n3=document.getElementById('biName3')?.value.trim()||'Control Variable';
 const raw1=document.getElementById('biData1')?.value||'',raw2=document.getElementById('biData2')?.value||'',raw3=document.getElementById('biData3')?.value||'',tok1=biTokens(raw1),tok2=biTokens(raw2),tok3=biTokens(raw3),out=document.getElementById('biResult'),det=document.getElementById('biDetected');
 if(!out||!det)return;
 if(tok1.length<2||tok2.length<2){det.innerHTML='<span class="bi-warn">Please enter at least two observations for each main variable.</span>';out.innerHTML='';return;}
 if(tok1.length!==tok2.length){det.innerHTML='<span class="bi-warn">Variable 1 and Variable 2 must have the same number of observations.</span>';out.innerHTML='';return;}
 const t1=biNum(raw1)?'Numerical':'Categorical',t2=biNum(raw2)?'Numerical':'Categorical',t3=raw3.trim()?(biNum(raw3)?'Numerical':'Categorical'):''; const s1=t1==='Categorical'?((window.BI_TYPES&&window.BI_TYPES[1])||biScaleGuess(tok1).type):'Numerical', s2=t2==='Categorical'?((window.BI_TYPES&&window.BI_TYPES[2])||biScaleGuess(tok2).type):'Numerical';
 if(raw3.trim()&&tok3.length!==tok1.length){det.innerHTML='<span class="bi-warn">The control variable must have the same number of observations as the main variables.</span>';out.innerHTML='';return;}
 if(raw3.trim()&&t3!=='Numerical'){det.innerHTML='<span class="bi-warn">Partial Correlation requires a numerical control variable.</span>';out.innerHTML='';return;}
 const x=t1==='Numerical'?tok1.map(Number):tok1,y=t2==='Numerical'?tok2.map(Number):tok2,z=t3==='Numerical'?tok3.map(Number):null;
 window.BI_CURRENT={x,y,z,n1,n2,n3,t1,t2,t3,s1,s2};
 let detected=`<b>Detected:</b> ${n1} → ${t1}${t1==='Categorical'?` → ${s1}`:''} &nbsp; | &nbsp; ${n2} → ${t2}${t2==='Categorical'?` → ${s2}`:''} &nbsp; | &nbsp; n = ${tok1.length}`;if(t3)detected+=` &nbsp; | &nbsp; ${n3} → ${t3}`;det.innerHTML=detected;
 const confirm1=t1==='Categorical'?`<div class="bi-type-confirm"><b>${n1}</b>: detected as <b>${s1}</b>. Choose the measurement level if needed: <button type="button" onclick="biSetType(1,'Ordinal')">Yes — Ordinal</button><button type="button" onclick="biSetType(1,'Nominal')">No — Nominal</button></div>`:'';
 const confirm2=t2==='Categorical'?`<div class="bi-type-confirm"><b>${n2}</b>: detected as <b>${s2}</b>. Choose the measurement level if needed: <button type="button" onclick="biSetType(2,'Ordinal')">Yes — Ordinal</button><button type="button" onclick="biSetType(2,'Nominal')">No — Nominal</button></div>`:'';
 out.innerHTML=confirm1+confirm2+`<div class="bi-section"><h4>Applicable Tools</h4><div class="bi-options">${biApplicableOptions(t1,t2,tok1,tok2,t3,tok3,s1,s2)}</div><div id="biSelectedResult" class="bi-selected-result"><p class="bi-note">Click an applicable tool to view only that tool's value, formula and comment.</p></div></div>`;
 biBindOptions();
}
if(document.getElementById('biData1'))window.runBivariate();

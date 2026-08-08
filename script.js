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
function calcDesc(){let el=document.getElementById("data");if(!el)return;let a=nums(el.value);if(a.length<2)return;let s=sd(a);document.getElementById("descResult").innerHTML=`<div class="result-grid"><div class="result-box"><span>n</span><strong>${a.length}</strong></div><div class="result-box"><span>Mean</span><strong>${mean(a).toFixed(5)}</strong></div><div class="result-box"><span>Median</span><strong>${median(a).toFixed(5)}</strong></div><div class="result-box"><span>Sample SD</span><strong>${s.toFixed(5)}</strong></div></div>`}

function logGamma(z){const g=7,C=[0.9999999999998099,676.5203681218851,-1259.1392167224028,771.3234287776531,-176.6150291621406,12.507343278686905,-0.13857109526572012,9.984369578019572e-6,1.5056327351493116e-7];if(z<.5)return Math.log(Math.PI)-Math.log(Math.sin(Math.PI*z))-logGamma(1-z);z-=1;let x=C[0];for(let i=1;i<C.length;i++)x+=C[i]/(z+i);let t=z+g+.5;return .5*Math.log(2*Math.PI)+(z+.5)*Math.log(t)-t+Math.log(x)}
function gamma(z){return Math.exp(logGamma(z))} function logChoose(n,k){if(k<0||k>n)return -Infinity;return logGamma(n+1)-logGamma(k+1)-logGamma(n-k+1)}
function erf(x){let s=x<0?-1:1;x=Math.abs(x);let a1=.254829592,a2=-.284496736,a3=1.421413741,a4=-1.453152027,a5=1.061405429,p=.3275911,t=1/(1+p*x);return s*(1-(((((a5*t+a4)*t+a3)*t+a2)*t+a1)*t)*Math.exp(-x*x))}
function normalPdf(x,m,s){return Math.exp(-.5*((x-m)/s)**2)/(s*Math.sqrt(2*Math.PI))} function normalCdf(x,m,s){return .5*(1+erf((x-m)/(s*Math.sqrt(2))))}
function simpson(f,a,b,n=800){if(b<=a)return 0;if(n%2)n++;let h=(b-a)/n,sum=f(a)+f(b);for(let i=1;i<n;i++)sum+=(i%2?4:2)*f(a+i*h);return sum*h/3}
function betaFunc(a,b){return Math.exp(logGamma(a)+logGamma(b)-logGamma(a+b))} function integrateCDF(pdf,x,lo){if(!Number.isFinite(x))return x>0?1:0;let a=lo,b=x;if(b<=a)return 0;return Math.min(1,Math.max(0,simpson(pdf,a,b,700)))}
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
default:return{v:NaN,c:NaN,m:NaN,vv:NaN,range:[-5,5],discrete:false}
}}

function calculateDist(){let spec=distSpec(),p=getParams(),x=Number(document.getElementById("xval")?.value);if(!Number.isFinite(x))x=spec.type==="Discrete"?0:(p.mu??p.a??0);let r=calcCore(spec.key,x,p);document.getElementById("pmf").textContent=Number.isFinite(r.v)?r.v.toPrecision(7):"N/A";document.getElementById("cdf").textContent=Number.isFinite(r.c)?r.c.toPrecision(7):"N/A";document.getElementById("mean").textContent=Number.isFinite(r.m)?r.m.toPrecision(7):"Undefined";document.getElementById("variance").textContent=Number.isFinite(r.vv)?r.vv.toPrecision(7):"Undefined";drawPlot(spec,p,r.range)}
function setupDist(){let spec=distSpec(),box=document.getElementById("fields");if(!box)return;document.getElementById("distTitle").textContent=spec.name;document.getElementById("typeTitle").textContent=spec.type+" distribution";let labels=spec.params.split(",");box.innerHTML=labels.map(p=>`<div class="field"><label>${p}</label><input data-p="${p}" value="${defaults[p]??1}"></div>`).join("")+`<div class="field"><label>x</label><input id="xval" value="${spec.type==="Discrete"?1:0}"></div>`;document.getElementById("calcBtn").onclick=calculateDist;document.getElementById("resetBtn").onclick=()=>setupDist();document.getElementById("note").textContent=spec.type==="Discrete"?"Point probability (PMF), CDF, theoretical moments and probability-mass graph.":"Point density (PDF), CDF, theoretical moments and density graph.";calculateDist()}
function drawPlot(spec,p,range){let c=document.getElementById("plot"),ctx=c.getContext("2d"),W=c.width,H=c.height;ctx.clearRect(0,0,W,H);let lo=range[0],hi=range[1];if(!Number.isFinite(lo)||!Number.isFinite(hi)||lo===hi){lo=-5;hi=5}let pad=45;ctx.strokeStyle="#9aa9bc";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(pad,H-pad);ctx.lineTo(W-pad,H-pad);ctx.moveTo(pad,20);ctx.lineTo(pad,H-pad);ctx.stroke();let vals=[];for(let i=0;i<=300;i++){let x=lo+(hi-lo)*i/300;let r=calcCore(spec.key,x,p);vals.push([x,Number.isFinite(r.v)?Math.max(0,r.v):0])}let ymax=Math.max(...vals.map(v=>v[1]),1e-8)*1.12;ctx.strokeStyle="#2563eb";ctx.lineWidth=3;ctx.beginPath();vals.forEach(([x,y],i)=>{let px=pad+(x-lo)/(hi-lo)*(W-2*pad),py=H-pad-y/ymax*(H-55);if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py)});ctx.stroke();ctx.fillStyle="#526176";ctx.font="14px Segoe UI";ctx.fillText(lo.toPrecision(4),pad,H-18);ctx.fillText(hi.toPrecision(4),W-pad-35,H-18);ctx.fillText("x",W-25,H-pad+5);ctx.fillText(spec.type==="Discrete"?"PMF":"PDF",pad+10,28)}
if(location.pathname.endsWith("distribution.html"))setupDist();
if(document.getElementById("distGrid")&&document.getElementById("search")){
function filterD(){const q=document.getElementById("search").value.toLowerCase(),t=document.getElementById("type").value;document.getElementById("distGrid").innerHTML=D.filter(d=>(t==="all"||d.type===t)&&d.name.toLowerCase().includes(q)).map(d=>`<a class="dist-card" href="distribution.html?name=${encodeURIComponent(d.name)}"><h4>${d.name}</h4><small>${d.type} distribution</small></a>`).join("")}
document.getElementById("search").addEventListener("input",filterD);document.getElementById("type").addEventListener("change",filterD);
}

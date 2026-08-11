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
function biNum(v){let a=biTokens(v), n=a.map(Number);return a.length===n.length && a.length>0 && n.every(Number.isFinite)}
function biNumeric(v){return biTokens(v).map(Number).filter(Number.isFinite)}
function biCategorical(v){return biTokens(v)}
function biFmt(x){return Number.isFinite(x)?(Math.abs(x)<1e-10?'0':x.toFixed(5)):'—'}
function biMean(a){return a.reduce((s,x)=>s+x,0)/a.length}
function biVariance(a){let m=biMean(a);return a.length>1?a.reduce((s,x)=>s+(x-m)**2,0)/(a.length-1):NaN}
function biPearson(x,y){let mx=biMean(x),my=biMean(y),sx=0,sy=0,c=0;for(let i=0;i<x.length;i++){let dx=x[i]-mx,dy=y[i]-my;c+=dx*dy;sx+=dx*dx;sy+=dy*dy}return c/Math.sqrt(sx*sy)}
function biRank(a){let idx=a.map((v,i)=>[v,i]).sort((u,v)=>u[0]-v[0]),r=Array(a.length),i=0;while(i<a.length){let j=i;while(j+1<a.length&&idx[j+1][0]===idx[i][0])j++;let av=(i+j+2)/2;for(let k=i;k<=j;k++)r[idx[k][1]]=av;i=j+1}return r}
function biSpearman(x,y){return biPearson(biRank(x),biRank(y))}
function biRegression(x,y){let mx=biMean(x),my=biMean(y),sxx=0,sxy=0;for(let i=0;i<x.length;i++){sxx+=(x[i]-mx)**2;sxy+=(x[i]-mx)*(y[i]-my)}let b=sxy/sxx,a=my-b*mx,r=biPearson(x,y);return{a,b,r,r2:r*r}}
function biGroups(a){let m=new Map();a.forEach(v=>m.set(v,(m.get(v)||0)+1));return [...m.entries()].sort((x,y)=>String(x[0]).localeCompare(String(y[0]),undefined,{numeric:true}))}
function biChiSquare(a,b){let rows=[...new Set(a)],cols=[...new Set(b)],obs=rows.map(r=>cols.map(c=>{let n=0;for(let i=0;i<a.length;i++)if(a[i]===r&&b[i]===c)n++;return n}));let rt=obs.map(r=>r.reduce((s,x)=>s+x,0)),ct=cols.map((_,j)=>obs.reduce((s,r)=>s+r[j],0)),N=a.length,chi=0;for(let i=0;i<rows.length;i++)for(let j=0;j<cols.length;j++){let e=rt[i]*ct[j]/N;if(e>0)chi+=(obs[i][j]-e)**2/e}return{chi,df:(rows.length-1)*(cols.length-1),rows,cols,obs}}
function biErf(x){return erf(x)}
function biNormalP(z){return .5*(1+biErf(z/Math.sqrt(2)))}
function biTApproxP(t,df){let z=Math.abs(t);if(df>100)return 2*(1-biNormalP(z));let x=df/(df+z*z);let a=df/2,b=.5;function ibeta(xx,aa,bb){let bt=xx===0||xx===1?0:Math.exp(logGamma(aa+bb)-logGamma(aa)-logGamma(bb)+aa*Math.log(xx)+bb*Math.log(1-xx));function cf(x,a,b){let qab=a+b,qap=a+1,qam=a-1,c=1,d=1-qab*x/qap;if(Math.abs(d)<1e-30)d=1e-30;d=1/d;let h=d;for(let m=1;m<=200;m++){let m2=2*m,aa1=m*(b-m)*x/((qam+m2)*(a+m2)),aa2=-(a+m)*(qab+m)*x/((a+m2)*(qap+m2));d=1+aa1*d;if(Math.abs(d)<1e-30)d=1e-30;c=1+aa1/c;if(Math.abs(c)<1e-30)c=1e-30;d=1/d;h*=d*c;d=1+aa2*d;if(Math.abs(d)<1e-30)d=1e-30;c=1+aa2/c;if(Math.abs(c)<1e-30)c=1e-30;d=1/d;let del=d*c;h*=del;if(Math.abs(del-1)<3e-7)break}return h}if(xx<(aa+1)/(aa+bb+2))return bt*cf(xx,aa,bb)/aa;return 1-bt*cf(1-xx,bb,aa)/bb}let tail=.5*ibeta(x,a,b);return Math.min(1,2*tail)}
function biTTest(x,y){let d=x.map((v,i)=>v-y[i]),m=biMean(d),s=Math.sqrt(biVariance(d)),t=m/(s/Math.sqrt(d.length)),df=d.length-1;return{t,df,p:biTApproxP(t,df)}}
function biBuildTable(ch){let html='<table class="bi-table"><thead><tr><th></th>'+ch.cols.map(c=>`<th>${c}</th>`).join('')+'</tr></thead><tbody>';ch.rows.forEach((r,i)=>{html+=`<tr><th>${r}</th>${ch.obs[i].map(v=>`<td>${v}</td>`).join('')}</tr>`});return html+'</tbody></table>'}
function runBivariate(){let n1=document.getElementById('biName1')?.value.trim()||'Variable 1',n2=document.getElementById('biName2')?.value.trim()||'Variable 2',raw1=document.getElementById('biData1')?.value||'',raw2=document.getElementById('biData2')?.value||'',tok1=biTokens(raw1),tok2=biTokens(raw2);let out=document.getElementById('biResult'),det=document.getElementById('biDetected');if(tok1.length<2||tok2.length<2){det.innerHTML='<span class="bi-warn">Please enter at least two observations for each variable.</span>';out.innerHTML='';return}if(tok1.length!==tok2.length){det.innerHTML='<span class="bi-warn">Both variables must have the same number of observations. Variable 1 has '+tok1.length+' and Variable 2 has '+tok2.length+'.</span>';out.innerHTML='';return}let t1=biNum(raw1)?'Numerical':'Categorical',t2=biNum(raw2)?'Numerical':'Categorical';det.innerHTML=`<b>Detected:</b> ${n1} → ${t1} &nbsp; | &nbsp; ${n2} → ${t2} &nbsp; | &nbsp; n = ${tok1.length}`;let html='';
if(t1==='Numerical'&&t2==='Numerical'){let x=tok1.map(Number),y=tok2.map(Number),r=biPearson(x,y),rs=biSpearman(x,y),cov=x.length>1?x.reduce((s,v,i)=>s+(v-biMean(x))*(y[i]-biMean(y)),0)/(x.length-1):NaN,reg=biRegression(x,y);html+=`<div class="bi-section"><h4>📌 Applicable analyses: Numerical × Numerical</h4><div class="bi-grid"><div class="bi-stat"><span>Pearson correlation (r)</span><strong>${biFmt(r)}</strong></div><div class="bi-stat"><span>Spearman correlation (ρ)</span><strong>${biFmt(rs)}</strong></div><div class="bi-stat"><span>Covariance</span><strong>${biFmt(cov)}</strong></div><div class="bi-stat"><span>R²</span><strong>${biFmt(reg.r2)}</strong></div></div></div><div class="bi-section"><h4>📈 Simple Linear Regression</h4><div class="bi-grid"><div class="bi-stat"><span>Intercept (a)</span><strong>${biFmt(reg.a)}</strong></div><div class="bi-stat"><span>Slope (b)</span><strong>${biFmt(reg.b)}</strong></div><div class="bi-stat"><span>Equation</span><strong>${n2} = ${biFmt(reg.a)} + ${biFmt(reg.b)}×${n1}</strong></div></div></div><div class="bi-note">For this pair, correlation, rank correlation, covariance and simple linear regression are applicable. A scatter plot can be added to the visualization section next.</div>`}
else if(t1==='Categorical'&&t2==='Categorical'){let a=tok1,b=tok2,ch=biChiSquare(a,b),phi=Math.sqrt(ch.chi/a.length),htmlTable=biBuildTable(ch);html+=`<div class="bi-section"><h4>📌 Applicable analyses: Categorical × Categorical</h4><h4>Cross-tabulation</h4>${htmlTable}<div class="bi-grid" style="margin-top:10px"><div class="bi-stat"><span>Chi-square (χ²)</span><strong>${biFmt(ch.chi)}</strong></div><div class="bi-stat"><span>Degrees of freedom</span><strong>${ch.df}</strong></div><div class="bi-stat"><span>Cramer's V</span><strong>${biFmt(Math.sqrt(ch.chi/(a.length*Math.min(ch.rows.length-1,ch.cols.length-1))))}</strong></div><div class="bi-stat"><span>Phi (when 2×2)</span><strong>${ch.rows.length===2&&ch.cols.length===2?biFmt(phi):'N/A'}</strong></div></div></div><div class="bi-note">For this pair, cross-tabulation, Chi-square test of independence and association measures are applicable.</div>`}
else{let cat=t1==='Categorical'?tok1:tok2,num=t1==='Numerical'?tok1.map(Number):tok2.map(Number),groups=biGroups(cat),summary=groups.map(([g])=>{let vals=num.filter((_,i)=>cat[i]===g);return [g,vals.length,biMean(vals),Math.sqrt(biVariance(vals))]});html+=`<div class="bi-section"><h4>📌 Applicable analyses: Categorical × Numerical</h4><table class="bi-table"><thead><tr><th>Group</th><th>n</th><th>Mean</th><th>SD</th></tr></thead><tbody>${summary.map(r=>`<tr>${r.map((v,i)=>`<td>${i>1?biFmt(v):v}</td>`).join('')}</tr>`).join('')}</tbody></table><div class="bi-grid" style="margin-top:10px"><div class="bi-stat"><span>Number of groups</span><strong>${groups.length}</strong></div><div class="bi-stat"><span>Overall mean</span><strong>${biFmt(biMean(num))}</strong></div></div></div><div class="bi-note">For this pair, group-wise descriptive statistics and boxplot/group comparison are applicable. Independent t-test is appropriate when there are exactly 2 groups; one-way ANOVA is appropriate when there are 3 or more groups.</div>`}
out.innerHTML=html}
function loadBiExample(){document.getElementById('biName1').value='Study Hours';document.getElementById('biName2').value='Marks';document.getElementById('biData1').value='2,3,4,5,6,7,8,9';document.getElementById('biData2').value='45,50,58,65,72,78,84,90';runBivariate()}
if(document.getElementById('biData1'))runBivariate();

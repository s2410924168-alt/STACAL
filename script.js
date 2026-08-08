const distributions=[
["Bernoulli","Discrete"],["Binomial","Discrete"],["Geometric","Discrete"],["Negative Binomial","Discrete"],["Hypergeometric","Discrete"],["Poisson","Discrete"],["Discrete Uniform","Discrete"],["Categorical","Discrete"],["Multinomial","Discrete"],["Zipf","Discrete"],["Logarithmic","Discrete"],["Skellam","Discrete"],["Discrete Laplace","Discrete"],["Beta-Binomial","Discrete"],["Dirichlet-Multinomial","Discrete"],["Borel","Discrete"],["Yule-Simon","Discrete"],["Benford","Discrete"],["Bivariate Poisson","Discrete"],["Chinese Restaurant Process","Discrete"],["Uniform","Continuous"],["Normal","Continuous"],["Exponential","Continuous"],["Gamma","Continuous"],["Beta","Continuous"],["Weibull","Continuous"],["Lognormal","Continuous"],["Cauchy","Continuous"],["Student's t","Continuous"],["F","Continuous"],["Chi-Square","Continuous"],["Logistic","Continuous"],["Laplace","Continuous"],["Pareto","Continuous"],["Rayleigh","Continuous"],["Gumbel","Continuous"],["Triangular","Continuous"],["Erlang","Continuous"],["Inverse Gaussian","Continuous"],["Fisher's z","Continuous"]
];

function renderDists(){
 const q=document.getElementById("distSearch").value.toLowerCase(), type=document.getElementById("distType").value;
 const box=document.getElementById("distGrid"); box.innerHTML="";
 distributions.filter(d=>(type==="all"||d[1]===type)&&d[0].toLowerCase().includes(q)).forEach((d,i)=>{
   const el=document.createElement("div");el.className="dist-card";el.innerHTML=`<h4>${d[0]}</h4><small>${d[1]} distribution</small>`;
   el.onclick=()=>openDist(d[0],d[1]);box.appendChild(el);
 });
}
document.getElementById("distSearch").addEventListener("input",renderDists);
document.getElementById("distType").addEventListener("change",renderDists); renderDists();

function nums(v){return v.split(",").map(Number).filter(Number.isFinite)}
function mean(a){return a.reduce((x,y)=>x+y,0)/a.length}
function median(a){a=[...a].sort((x,y)=>x-y);let n=a.length;return n%2?a[(n-1)/2]:(a[n/2-1]+a[n/2])/2}
function sd(a){let m=mean(a);return Math.sqrt(a.reduce((s,x)=>s+(x-m)**2,0)/(a.length-1))}
function updateQuick(){let a=nums(document.getElementById("quickData").value);if(!a.length)return;document.getElementById("qMean").textContent=mean(a).toFixed(4);document.getElementById("qMedian").textContent=median(a).toFixed(4);document.getElementById("qSD").textContent=a.length>1?sd(a).toFixed(4):"—";document.getElementById("qN").textContent=a.length}
document.getElementById("quickData").addEventListener("input",updateQuick);updateQuick();

function openTool(type){
 const m=document.getElementById("modal"), c=document.getElementById("modalContent");m.classList.remove("hidden");
 if(type==="descriptive")c.innerHTML=`<h2>Descriptive Statistics</h2><p>Enter observations separated by commas.</p><input id="ddata" value="10, 12, 15, 18, 20, 25"><button class="calc-btn" onclick="calcDesc()">Calculate</button><div id="dres"></div>`;
 if(type==="regression")c.innerHTML=`<h2>Correlation & Simple Regression</h2><div class="calc-row"><div><label>X values</label><input id="xdata" value="1,2,3,4,5"></div><div><label>Y values</label><input id="ydata" value="2,4,5,4,6"></div></div><button class="calc-btn" onclick="calcReg()">Calculate</button><div id="rres"></div>`;
 if(type==="laplace")c.innerHTML=`<h2>Laplace Transform Quick Lookup</h2><p>Select a common function.</p><select id="lap"><option value="1">1</option><option value="t">t</option><option value="t^n">tⁿ</option><option value="e^at">eᵃᵗ</option><option value="sin(at)">sin(at)</option><option value="cos(at)">cos(at)</option><option value="sinh(at)">sinh(at)</option><option value="cosh(at)">cosh(at)</option></select><button class="calc-btn" onclick="laplace()">Find Transform</button><div id="lres"></div>`;
 if(type==="distribution")c.innerHTML=`<h2>Distribution Calculator</h2><p>This starter calculator demonstrates common exact formulas. Choose a distribution and enter parameters.</p><select id="distCalc"><option>Bernoulli</option><option>Binomial</option><option>Poisson</option><option>Normal</option><option>Exponential</option><option>Uniform</option><option>Geometric</option></select><div class="calc-row"><input id="p1" type="number" value="0.5" step="any" placeholder="Parameter 1"><input id="p2" type="number" value="10" step="any" placeholder="Parameter 2"></div><input id="xval" type="number" value="3" step="any" placeholder="x"><button class="calc-btn" onclick="calcDist()">Calculate</button><div id="distRes"></div>`;
}
function closeTool(){document.getElementById("modal").classList.add("hidden")}
function calcDesc(){let a=nums(document.getElementById("ddata").value);if(!a.length)return;let s=sd(a);let m=mean(a);let sorted=[...a].sort((x,y)=>x-y);let mode=sorted.sort((a,b)=>a-b).reduce((acc,x)=>{acc[x]=(acc[x]||0)+1;return acc},{});let modeVal=Object.entries(mode).sort((a,b)=>b[1]-a[1])[0];document.getElementById("dres").innerHTML=`<div class="result"><p>n = ${a.length}</p><p>Mean = <strong>${m.toFixed(5)}</strong></p><p>Median = <strong>${median(a).toFixed(5)}</strong></p><p>Sample SD = <strong>${s.toFixed(5)}</strong></p><p>Sample Variance = <strong>${(s*s).toFixed(5)}</strong></p><p>Range = <strong>${Math.max(...a)-Math.min(...a)}</strong></p><p>Mode = <strong>${modeVal&&modeVal[1]>1?modeVal[0]:"No unique mode"}</strong></p></div>`}
function calcReg(){let x=nums(document.getElementById("xdata").value),y=nums(document.getElementById("ydata").value);if(x.length!==y.length||x.length<2){alert("X and Y must have the same number of values.");return}let mx=mean(x),my=mean(y),num=x.reduce((s,v,i)=>s+(v-mx)*(y[i]-my),0),den=x.reduce((s,v)=>s+(v-mx)**2,0),b=num/den,a=my-b*mx,r=num/Math.sqrt(den*y.reduce((s,v)=>s+(v-my)**2,0));document.getElementById("rres").innerHTML=`<div class="result"><p>Slope b = <strong>${b.toFixed(5)}</strong></p><p>Intercept a = <strong>${a.toFixed(5)}</strong></p><p>Regression: <strong>ŷ = ${a.toFixed(4)} + ${b.toFixed(4)}x</strong></p><p>Pearson r = <strong>${r.toFixed(5)}</strong></p><p>R² = <strong>${(r*r).toFixed(5)}</strong></p></div>`}
function laplace(){let v=document.getElementById("lap").value,t={"1":"1/s","t":"1/s²","t^n":"n!/sⁿ⁺¹","e^at":"1/(s−a)","sin(at)":"a/(s²+a²)","cos(at)":"s/(s²+a²)","sinh(at)":"a/(s²−a²)","cosh(at)":"s/(s²−a²)"}[v];document.getElementById("lres").innerHTML=`<div class="result"><p>ℒ{${v}} = <strong>${t}</strong></p></div>`}
function openDist(name,type){openTool("distribution");document.getElementById("distCalc").value=["Bernoulli","Binomial","Poisson","Normal","Exponential","Uniform","Geometric"].includes(name)?name:"Bernoulli"}
function factorial(n){let z=1;for(let i=2;i<=n;i++)z*=i;return z}
function calcDist(){let d=document.getElementById("distCalc").value,p=+document.getElementById("p1").value,q=+document.getElementById("p2").value,x=+document.getElementById("xval").value,val;
 if(d==="Bernoulli")val=(x===1?p:x===0?1-p:0);
 else if(d==="Binomial"){let k=Math.round(x);val=(k>=0&&k<=q)?factorial(q)/(factorial(k)*factorial(q-k))*p**k*(1-p)**(q-k):0}
 else if(d==="Poisson"){val=x>=0?Math.exp(-p)*p**x/factorial(Math.round(x)):0}
 else if(d==="Normal"){let mu=p,sigma=q;val=Math.exp(-.5*((x-mu)/sigma)**2)/(sigma*Math.sqrt(2*Math.PI))}
 else if(d==="Exponential")val=x>=0?p*Math.exp(-p*x):0;
 else if(d==="Uniform")val=x>=p&&x<=q?1/(q-p):0;
 else if(d==="Geometric")val=x>=1?p*(1-p)**(x-1):0;
 document.getElementById("distRes").innerHTML=`<div class="result"><p>${d} probability/density at x =</p><strong>${Number.isFinite(val)?val.toFixed(8):"Check parameters"}</strong></div>`;
}
document.getElementById("themeBtn").onclick=()=>{document.body.classList.toggle("dark");document.getElementById("themeBtn").textContent=document.body.classList.contains("dark")?"☀":"☾"}

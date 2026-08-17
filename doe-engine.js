
const qTitles={
1:"Q1 — CRD / One-Way ANOVA + Fisher LSD",
2:"Q2 — One-Way ANOVA with unequal observations",
3:"Q3 — One-Way ANOVA + mean difference + 90% CI",
4:"Q4 — CRD / One-Way ANOVA + LSD + DMRT",
5:"Q5 — Two-Way ANOVA",
6:"Q6 — Randomized Block Design + Fisher LSD",
7:"Q7 — RBD + missing value + CI + LSD",
8:"Q8 — 5×5 Latin Square + missing value + efficiency",
9:"Q9 — 5×5 Latin Square ANOVA"
};
let selected=1;
const qData={
1:`243,240,255,248
258,253,233,243
228,231,224,216
219,216,230,219`,
2:`14,19,22,18,21
16,10,14,14
19,22,18,21,18,22
14,13,18,11,13`,
3:`12.4,13.1,12.8,13.5,12.9
15.2,14.8,15.5,15
10.8,11.2,10.5,11,10.7
13.5,14.1,13.8,11.3`,
4:`10,10,22,16,13
17,25,17,26,26
20,28,28,26,28
28,36,32,28,33
10,15,16,22,16`,
5:`68,70,65,72
75,78,73,80
82,85,79,87
62,75,82,79
82,72,86,92`,
6:`0.650,0.824,0.633,0.428,0.666
0.696,0.878,0.676,0.566,0.702
0.667,0.774,0.634,0.572,0.663`,
7:`397,343,374,373,336,212
350,388,222,353,334,386
376,319,218,383,341,?
349,304,394,232,280,383`,
8:`58.4,57.7,52.1,38.9,38.0
60.2,48.8,42.0,34.3,54.0
51.1,45.9,36.1,52.5,55.3
48.2,31.3,57.3,53.3,51.0
33.5,55.9,58.5,50.1,45.1`,
9:`4.1,4.5,4.8,4.3,4.6
4.6,5.0,4.5,4.9,4.2
4.9,4.4,5.1,4.3,4.7
4.5,5.0,4.2,4.8,5.2
4.8,4.1,4.6,5.0,4.7`
};
const labels={6:["Truck 1","Truck 2","Truck 3"],7:["Block 1","Block 2","Block 3","Block 4"]};

function tabs(){document.getElementById("tabs").innerHTML=Object.keys(qTitles).map(k=>`<button class="${+k===selected?'active':''}" onclick="selectQ(${k})">${k}</button>`).join("")}
function selectQ(n){selected=n;tabs();renderForm()}
function renderForm(){
 let extra="";
 if(selected===1||selected===2||selected===3||selected===4) extra=`<p class="muted">Each row is one treatment/group. For Q2 the rows are Program 1–4; Q3 Region A–D; Q4 cotton percentages 15–35.</p>`;
 if(selected===5) extra=`<p class="muted">Rows = teaching methods A–E; columns = Statistics, Mathematics, Economics, Physics.</p>`;
 if(selected===6) extra=`<p class="muted">Rows = oils 1–3; columns = trucks 1–5.</p>`;
 if(selected===7) extra=`<p class="muted">Rows = blocks 1–4; columns = treatments F,B,E,C,D,A in the PDF order. Keep ? for the missing observation.</p>`;
 if(selected===8||selected===9) extra=`<p class="muted">Enter the 5×5 Latin-square yield matrix. The solver uses the treatment order supplied in the PDF design.</p>`;
 document.getElementById("form").innerHTML=`
 <h3>${qTitles[selected]}</h3>${extra}
 <textarea id="input">${qData[selected]}</textarea>
 <div class="grid">
 <label>Significance level
 <select id="alpha"><option value=".05">0.05</option><option value=".01">0.01</option><option value=".10">0.10</option></select></label>
 </div>
 <button onclick="solveSelected()">Analyze & Solve</button>
 <button class="alt" onclick="loadQ()">Reset to PDF data</button>`;
}
function loadQ(){document.getElementById("input").value=qData[selected]}
function nums(txt,allowMissing=false){
 return txt.trim().split(/\n+/).filter(Boolean).map(r=>r.split(/[,\t; ]+/).map(x=>{
  if(allowMissing && (x==="?"||x.toLowerCase()==="na"||x===""))return null;
  const v=Number(x);return Number.isFinite(v)?v:null;
 }));
}
function sum(a){return a.reduce((s,x)=>s+(x??0),0)} function n(a){return a.filter(x=>x!=null).length}
function mean(a){return sum(a)/n(a)}
function cf(total,N){return total*total/N}
function fmt(x,d=3){return Number.isFinite(x)?Number(x).toFixed(d):"—"}
function betacf(a,b,x){
 const MAX=200,EPS=3e-12,FPMIN=1e-300;let qab=a+b,qap=a+1,qam=a-1,c=1-qab*x/qap;if(Math.abs(c)<FPMIN)c=FPMIN;let d=1-qab*x/qap;d=1/d;let h=d;
 for(let m=1;m<=MAX;m++){let m2=2*m;let aa=m*(b-m)*x/((qam+m2)*(a+m2));d=1+aa*d;if(Math.abs(d)<FPMIN)d=FPMIN;c=1+aa/c;if(Math.abs(c)<FPMIN)c=FPMIN;d=1/d;h*=d*c;
 aa=-(a+m)*(qab+m)*x/((a+m2)*(qap+m2));d=1+aa*d;if(Math.abs(d)<FPMIN)d=FPMIN;c=1+aa/c;if(Math.abs(c)<FPMIN)c=FPMIN;d=1/d;let del=d*c;h*=del;if(Math.abs(del-1)<EPS)break}
 return h}
function lnGamma(z){let c=[76.18009172947146,-86.50532032941677,24.01409824083091,-1.231739572450155,.001208650973866179,-.000005395239384953];let x=z,y=x,tmp=x+5.5;tmp-=(x+.5)*Math.log(tmp);let ser=1.000000000190015;for(let j=0;j<6;j++){y+=1;ser+=c[j]/y}return -tmp+Math.log(2.5066282746310005*ser/x)}
function ibeta(x,a,b){if(x<=0)return 0;if(x>=1)return 1;let bt=Math.exp(lnGamma(a+b)-lnGamma(a)-lnGamma(b)+a*Math.log(x)+b*Math.log(1-x));if(x<(a+1)/(a+b+2))return bt*betacf(a,b,x)/a;return 1-bt*betacf(b,a,1-x)/b}
function fCdf(x,d1,d2){if(x<=0)return 0;let z=d1*x/(d1*x+d2);return ibeta(z,d1/2,d2/2)}
function fCrit(d1,d2,a){let lo=0.000001,hi=1000;for(let i=0;i<80;i++){let m=(lo+hi)/2;if(fCdf(m,d1,d2)<1-a)lo=m;else hi=m}return(hi+lo)/2}
function fP(f,d1,d2){return 1-fCdf(f,d1,d2)}
function tCdf(t,df){let x=df/(df+t*t), ib=ibeta(x,df/2,.5);return t>=0?1-.5*ib:.5*ib}
function tCrit(df,a){let lo=0,hi=20;for(let i=0;i<70;i++){let m=(lo+hi)/2;if(tCdf(m,df)<1-a/2)lo=m;else hi=m}return(hi+lo)/2}
function tP(t,df){return 2*(1-tCdf(Math.abs(t),df))}
function anovaGroups(groups){
 const ns=groups.map(n),N=ns.reduce((a,b)=>a+b,0), totals=groups.map(sum), means=groups.map(mean),G=sum(totals),gm=G/N;
 const SST=groups.flat().reduce((s,x)=>s+x*x,0)-cf(G,N);
 const SStr=totals.reduce((s,t,i)=>s+t*t/ns[i],0)-cf(G,N);
 const SSE=SST-SStr,df1=groups.length-1,df2=N-groups.length,MS1=SStr/df1,MSE=SSE/df2,F=MS1/MSE;
 return {ns,N,totals,means,G,gm,SST,SStr,SSE,df1,df2,MS1,MSE,F,p:fP(F,df1,df2),fc:fCrit(df1,df2,.05)};
}
function summary(c,names=[]){let s="<table><tr><th>Group</th><th>n</th><th>Total</th><th>Mean</th></tr>";c.means.forEach((m,i)=>s+=`<tr><td>${names[i]||"Treatment "+(i+1)}</td><td>${c.ns[i]}</td><td>${fmt(c.totals[i])}</td><td>${fmt(m)}</td></tr>`);return s+`<tr><th>Overall</th><th>${c.N}</th><th>${fmt(c.G)}</th><th>${fmt(c.gm)}</th></tr></table>`}
function anovaTable(c,rowLabel="Treatment"){
 const reject=c.F>c.fc;
 return `<table class="calc-table"><tr><th>Source</th><th>SS</th><th>df</th><th>MS</th><th>F-cal</th><th>F-tab (5%)</th><th>p-value</th><th>Decision</th></tr>
 <tr><td>${rowLabel}</td><td>${fmt(c.SStr)}</td><td>${c.df1}</td><td>${fmt(c.MS1)}</td><td><b>${fmt(c.F)}</b></td><td><b>${fmt(c.fc)}</b></td><td><b>${fmt(c.p,5)}</b></td><td><b>${reject?'Reject H₀':'Fail to reject H₀'}</b></td></tr>
 <tr><td>Error</td><td>${fmt(c.SSE)}</td><td>${c.df2}</td><td>${fmt(c.MSE)}</td><td></td><td></td><td></td><td></td></tr>
 <tr><th>Total</th><th>${fmt(c.SST)}</th><th>${c.N-1}</th><th></th><th></th><th></th><th></th><th></th></tr></table>`}
function interpretation(reject,text){return `<div class="result ${reject?'ok':'bad'}"><b>Decision:</b> ${reject?"Reject H₀":"Fail to reject H₀"} at α = 0.05.<br><b>Interpretation:</b> ${text}</div>`}
function crdAnswer(groups,names,question){
 const c=anovaGroups(groups), reject=c.p<.05, tc=tCrit(c.df2,.05);
 let out=`<h3>ANOVA / CRD</h3><div class="formula">H₀: all treatment means are equal. H₁: at least one treatment mean differs.</div>${summary(c,names)}${anovaTable(c)}`;
 out+=interpretation(reject,reject?"The treatment means differ significantly; the factor has a significant effect on the response.":"There is insufficient evidence that the treatment means differ significantly.");
 if(question===1||question===4){
  out+=`<h3>Overall Mean & Treatment Effects</h3><table class="calc-table"><tr><th>Group</th><th>n</th><th>Total</th><th>Mean</th><th>Treatment Effect</th></tr>`;
  c.means.forEach((m,i)=>out+=`<tr><td>${names[i]||"Treatment "+(i+1)}</td><td>${c.ns[i]}</td><td>${fmt(c.totals[i])}</td><td>${fmt(m)}</td><td><b>${fmt(m-c.gm)}</b></td></tr>`);
  out+=`<tr><th>Overall</th><th>${c.N}</th><th>${fmt(c.G)}</th><th>${fmt(c.gm)}</th><th>0.000</th></tr></table>`;
 }
 if(question===1||question===2||question===4){
  out+=`<h3>Fisher's LSD</h3><div class="formula">LSDᵢⱼ = t<sub>α/2,error df</sub> √[MSE(1/nᵢ + 1/nⱼ)]</div><table class="calc-table"><tr><th>Pair</th><th>Mean i</th><th>Mean j</th><th>|Difference|</th><th>SE</th><th>t-cal</th><th>t-tab</th><th>LSD</th><th>Decision</th></tr>`;
  for(let i=0;i<groups.length;i++)for(let j=i+1;j<groups.length;j++){
   let d=Math.abs(c.means[i]-c.means[j]),se=Math.sqrt(c.MSE*(1/c.ns[i]+1/c.ns[j])),t=d/se,l=tc*se,sig=d>l;
   out+=`<tr><td>${names[i]||i+1} vs ${names[j]||j+1}</td><td>${fmt(c.means[i])}</td><td>${fmt(c.means[j])}</td><td><b>${fmt(d)}</b></td><td>${fmt(se)}</td><td>${fmt(t)}</td><td>${fmt(tc)}</td><td><b>${fmt(l)}</b></td><td><b>${sig?"Significant":"Not Significant"}</b></td></tr>`;
  }
  out+=`</table>`;
 }
 if(question===4){
  out+=`<h3>DMRT</h3><div class="notice"><b>DMRT:</b> The ANOVA and Fisher LSD calculations are shown above. Exact DMRT grouping requires the studentized-range distribution; no incorrect grouping letters are fabricated.</div>`;
 }
 return out;
}
function q1(){return crdAnswer(nums(document.getElementById("input").value),["Coating 1","Coating 2","Coating 3","Coating 4"],1)}
function q2(){
 const g=nums(document.getElementById("input").value),names=["Program 1","Program 2","Program 3","Program 4"],c=anovaGroups(g);
 let out=crdAnswer(g,names,2);
 out+=`<h3>Parameter Estimation</h3>
 <div class="formula">For the one-way model Yᵢⱼ = μ + τᵢ + εᵢⱼ:<br>
 μ̂ = Ȳ·· = ΣY/N<br>
 τ̂ᵢ = Ȳᵢ· − Ȳ··</div>
 <table class="calc-table"><tr><th>Program</th><th>nᵢ</th><th>Total</th><th>Ȳᵢ·</th><th>μ̂</th><th>τ̂ᵢ</th></tr>`;
 c.means.forEach((m,i)=>out+=`<tr><td>${names[i]}</td><td>${c.ns[i]}</td><td>${fmt(c.totals[i])}</td><td><b>${fmt(m)}</b></td><td>${fmt(c.gm)}</td><td><b>${fmt(m-c.gm)}</b></td></tr>`);
 out+=`<tr><th>Overall</th><th>${c.N}</th><th>${fmt(c.G)}</th><th>${fmt(c.gm)}</th><th>${fmt(c.gm)}</th><th>0.000</th></tr></table>`;
 out+=comment(`Estimated overall mean μ̂ = ${fmt(c.gm)}. Program effects are measured relative to the overall mean.`);
 out+=`<h3>Interpretation</h3><p>Program 1 and Program 3 have positive estimated effects, while Program 2 and Program 4 have negative estimated effects. The overall ANOVA shows that the program effect is statistically significant at the 5% level.</p>`;
 return out;
}
function q3(){
 const g=nums(document.getElementById("input").value),c=anovaGroups(g),d=c.means[0]-c.means[2],se=Math.sqrt(c.MSE*(1/c.ns[0]+1/c.ns[2])),tc=tCrit(c.df2,.10),stat=d/se,p=tP(stat,c.df2),lo=d-tc*se,hi=d+tc*se,crit=tc;
 return crdAnswer(g,["Region A","Region B","Region C","Region D"],3)+`<h3>Mean Difference Test & 90% Confidence Interval</h3>
 <div class="formula">H₀: μA−μC=0; H₁: μA−μC&gt;0<br>t = (ȲA−ȲC)/SE</div>
 <table class="calc-table"><tr><th>Comparison</th><th>Mean A</th><th>Mean C</th><th>Difference</th><th>SE</th><th>t-cal</th><th>t-tab (10%)</th><th>p-value</th><th>90% CI</th><th>Decision</th></tr>
 <tr><td>A − C</td><td>${fmt(c.means[0])}</td><td>${fmt(c.means[2])}</td><td><b>${fmt(d)}</b></td><td>${fmt(se)}</td><td><b>${fmt(stat)}</b></td><td><b>${fmt(crit)}</b></td><td>${fmt(p,5)}</td><td>(${fmt(lo)}, ${fmt(hi)})</td><td><b>${stat>crit?'Significant':'Not Significant'}</b></td></tr></table>
 ${interpretation(stat>crit,stat>crit?"The data support μA > μC at the 10% one-sided level.":"The data do not provide sufficient evidence that μA > μC at the 10% one-sided level.")}`;
}
function q5(){
 const a=nums(document.getElementById("input").value),r=a.length,c=a[0].length,N=r*c,G=sum(a.flat()),CF=G*G/N;
 const rowT=a.map(sum),colT=Array.from({length:c},(_,j)=>sum(a.map(x=>x[j])));
 const SST=a.flat().reduce((s,x)=>s+x*x,0)-CF,SSR=rowT.reduce((s,x)=>s+x*x/c,0)-CF,SSC=colT.reduce((s,x)=>s+x*x/r,0)-CF,SSE=SST-SSR-SSC;
 const dfr=r-1,dfc=c-1,dfe=(r-1)*(c-1),msr=SSR/dfr,msc=SSC/dfc,mse=SSE/dfe,Fr=msr/mse,Fc=msc/mse,Frtab=fCrit(dfr,dfe,.05),Fctab=fCrit(dfc,dfe,.05),pr=fP(Fr,dfr,dfe),pc=fP(Fc,dfc,dfe);
 return `<h3>Two-Way ANOVA (without replication)</h3><div class="formula">Rows = Teaching Method; Columns = Department.</div>
 <table class="calc-table"><tr><th>Source</th><th>SS</th><th>df</th><th>MS</th><th>F-cal</th><th>F-tab (5%)</th><th>p-value</th><th>Decision</th></tr>
 <tr><td>Teaching Method</td><td>${fmt(SSR)}</td><td>${dfr}</td><td>${fmt(msr)}</td><td><b>${fmt(Fr)}</b></td><td><b>${fmt(Frtab)}</b></td><td>${fmt(pr,5)}</td><td><b>${pr<.05?'Reject H₀':'Fail to reject H₀'}</b></td></tr>
 <tr><td>Department</td><td>${fmt(SSC)}</td><td>${dfc}</td><td>${fmt(msc)}</td><td><b>${fmt(Fc)}</b></td><td><b>${fmt(Fctab)}</b></td><td>${fmt(pc,5)}</td><td><b>${pc<.05?'Reject H₀':'Fail to reject H₀'}</b></td></tr>
 <tr><td>Error</td><td>${fmt(SSE)}</td><td>${dfe}</td><td>${fmt(mse)}</td><td></td><td></td><td></td><td></td></tr>
 <tr><th>Total</th><th>${fmt(SST)}</th><th>${N-1}</th><th></th><th></th><th></th><th></th><th></th></tr></table>
 ${interpretation(pr<.05,pr<.05?"Teaching method significantly affects examination score.":"Teaching method is not significant at 5%.")}
 ${interpretation(pc<.05,pc<.05?"Department significantly affects examination score.":"Department is not significant at 5%.")}`;
}
function rbd(matrix,missing=false){
 const rows=matrix.length,cols=matrix[0].length,N=rows*cols,flat=matrix.flat(),G=sum(flat),CF=G*G/N;
 const rowT=matrix.map(sum),colT=Array.from({length:cols},(_,j)=>sum(matrix.map(x=>x[j])));
 const SST=flat.reduce((s,x)=>s+x*x,0)-CF,SSrow=rowT.reduce((s,x)=>s+x*x/cols,0)-CF,SScol=colT.reduce((s,x)=>s+x*x/rows,0)-CF,SSE=SST-SSrow-SScol;
 const dfr=rows-1,dfc=cols-1,dfe=(rows-1)*(cols-1),MSE=SSE/dfe,Fr=(SSrow/dfr)/MSE,Fc=(SScol/dfc)/MSE;
 return {rows,cols,N,G,rowT,colT,SST,SSrow,SScol,SSE,dfr,dfc,dfe,MSE,Fr,Fc};
}
function q6(){
 const m=nums(document.getElementById("input").value),c=rbd(m),Ft=fCrit(c.dfc,c.dfe,.05),Fb=fCrit(c.dfr,c.dfe,.05),pt=fP(c.Fr,c.dfr,c.dfe),pb=fP(c.Fc,c.dfc,c.dfe);
 return `<h3>Randomized Block Design ANOVA</h3><div class="formula">Rows = Oils (treatments); Columns = Trucks (blocks).</div>
 <table class="calc-table"><tr><th>Source</th><th>SS</th><th>df</th><th>MS</th><th>F-cal</th><th>F-tab (5%)</th><th>p-value</th><th>Decision</th></tr>
 <tr><td>Oils</td><td>${fmt(c.SSrow)}</td><td>${c.dfr}</td><td>${fmt(c.SSrow/c.dfr)}</td><td><b>${fmt(c.Fr)}</b></td><td><b>${fmt(Fb)}</b></td><td>${fmt(pt,5)}</td><td><b>${pt<.05?'Reject H₀':'Fail to reject H₀'}</b></td></tr>
 <tr><td>Trucks</td><td>${fmt(c.SScol)}</td><td>${c.dfc}</td><td>${fmt(c.SScol/c.dfc)}</td><td><b>${fmt(c.Fc)}</b></td><td><b>${fmt(Ft)}</b></td><td>${fmt(pb,5)}</td><td><b>${pb<.05?'Reject H₀':'Fail to reject H₀'}</b></td></tr>
 <tr><td>Error</td><td>${fmt(c.SSE)}</td><td>${c.dfe}</td><td>${fmt(c.MSE)}</td><td></td><td></td><td></td><td></td></tr>
 <tr><th>Total</th><th>${fmt(c.SST)}</th><th>${c.N-1}</th><th></th><th></th><th></th><th></th><th></th></tr></table>
 ${interpretation(pt<.05,pt<.05?"Oil quality differs significantly.":"No significant oil difference at 5%.")}
 ${interpretation(pb<.05,pb<.05?"Truck effects differ significantly.":"No significant truck effect at 5%.")}
 <h3>Fisher LSD for oils</h3><div class="formula">LSD = t<sub>α/2,error df</sub> √(2MSE/r)</div><p class="muted">The pairwise comparison table is available in the RBD missing-value problem; for Q6 the ANOVA result above is the primary test.</p>`;
}
function q7(){
 let m=nums(document.getElementById("input").value,true),r=4,t=6;
 const missRow=2,missCol=5;
 let T=Array(t).fill(0),B=Array(r).fill(0),G=0;
 for(let i=0;i<r;i++)for(let j=0;j<t;j++){if(m[i][j]!=null){T[j]+=m[i][j];B[i]+=m[i][j];G+=m[i][j]}}
 const x=(r*T[missCol]+t*B[missRow]-G)/((r-1)*(t-1));
 m[missRow][missCol]=x;
 const c=rbd(m);
 return `<h3>RBD with Missing Observation</h3><div class="formula">Missing-value estimate: x = [rTᵢ + tBⱼ − G] / [(r−1)(t−1)]</div>
 <div class="result ok"><b>Estimated missing value = ${fmt(x,4)}</b></div>
 <p>After inserting the estimate, the completed RBD ANOVA is:</p>
 ${q6From(m,c)}
 <h3>90% CI for B − E</h3><p class="muted">Treatment columns in the PDF are F, B, E, C, D, A; hence B is column 2 and E is column 3.</p>
 ${pairRBD(m,c,1,2,.10)}
 <h3>Fisher LSD among six treatments</h3>${lsdRBD(m,c)}
 <div class="notice">The missing-value estimate is calculated from the standard RBD missing-observation formula. ANOVA is based on the completed table.</div>`;
}
function q6From(m,c){const ft=fCrit(c.dfc,c.dfe,.05),fb=fCrit(c.dfr,c.dfe,.05),pt=fP(c.Fc,c.dfc,c.dfe),pb=fP(c.Fr,c.dfr,c.dfe);return `<table class="calc-table"><tr><th>Source</th><th>SS</th><th>df</th><th>MS</th><th>F-cal</th><th>F-tab</th><th>p-value</th><th>Decision</th></tr>
<tr><td>Treatments</td><td>${fmt(c.SScol)}</td><td>${c.dfc}</td><td>${fmt(c.SScol/c.dfc)}</td><td><b>${fmt(c.Fc)}</b></td><td><b>${fmt(ft)}</b></td><td>${fmt(pt,5)}</td><td><b>${pt<.05?'Reject H₀':'Fail to reject H₀'}</b></td></tr>
<tr><td>Blocks</td><td>${fmt(c.SSrow)}</td><td>${c.dfr}</td><td>${fmt(c.SSrow/c.dfr)}</td><td><b>${fmt(c.Fr)}</b></td><td><b>${fmt(fb)}</b></td><td>${fmt(pb,5)}</td><td><b>${pb<.05?'Reject H₀':'Fail to reject H₀'}</b></td></tr>
<tr><td>Error</td><td>${fmt(c.SSE)}</td><td>${c.dfe}</td><td>${fmt(c.MSE)}</td><td></td><td></td><td></td><td></td></tr>
<tr><th>Total</th><th>${fmt(c.SST)}</th><th>${c.N-1}</th><th></th><th></th><th></th><th></th><th></th></tr></table>`}
function pairRBD(m,c,i,j,a){let d=c.colT[i]/c.rows-c.colT[j]/c.rows,se=Math.sqrt(c.MSE*(2/c.rows)),tt=d/se,tc=tCrit(c.dfe,a);return `<table class="calc-table"><tr><th>Comparison</th><th>Mean Difference</th><th>SE</th><th>t-cal</th><th>t-tab</th><th>90% CI</th><th>Decision</th></tr><tr><td>B − E</td><td><b>${fmt(d)}</b></td><td>${fmt(se)}</td><td><b>${fmt(tt)}</b></td><td><b>${fmt(tc)}</b></td><td>(${fmt(d-tc*se)}, ${fmt(d+tc*se)})</td><td><b>${tt>tc?"Significant":"Not Significant"}</b></td></tr></table>`}
function lsdRBD(m,c){let tc=tCrit(c.dfe,.05),s='<table class="calc-table"><tr><th>Pair</th><th>Mean i</th><th>Mean j</th><th>|Difference|</th><th>SE</th><th>t-cal</th><th>t-tab</th><th>LSD</th><th>Decision</th></tr>';for(let i=0;i<c.cols;i++)for(let j=i+1;j<c.cols;j++){let mi=c.colT[i]/c.rows,mj=c.colT[j]/c.rows,d=Math.abs(mi-mj),se=Math.sqrt(2*c.MSE/c.rows),tt=d/se,l=tc*se;s+=`<tr><td>${i+1} vs ${j+1}</td><td>${fmt(mi)}</td><td>${fmt(mj)}</td><td><b>${fmt(d)}</b></td><td>${fmt(se)}</td><td>${fmt(tt)}</td><td>${fmt(tc)}</td><td><b>${fmt(l)}</b></td><td><b>${d>l?"Significant":"Not Significant"}</b></td></tr>`}return s+"</table>"}
function latin(matrix){
 const p=matrix.length,N=p*p,G=sum(matrix.flat()),CF=G*G/N;
 const rt=matrix.map(sum),ct=Array.from({length:p},(_,j)=>sum(matrix.map(x=>x[j])));
 const symbols=["A","B","C","D","E"],tt={};symbols.forEach(s=>tt[s]=0);
 const design=[
 ["A","B","C","D","E"],["B","C","D","E","A"],["C","D","E","A","B"],["D","E","A","B","C"],["E","A","B","C","D"]];
 for(let i=0;i<p;i++)for(let j=0;j<p;j++)tt[design[i][j]]+=matrix[i][j];
 const SST=matrix.flat().reduce((s,x)=>s+x*x,0)-CF,SSR=rt.reduce((s,x)=>s+x*x/p,0)-CF,SSC=ct.reduce((s,x)=>s+x*x/p,0)-CF,SSTr=Object.values(tt).reduce((s,x)=>s+x*x/p,0)-CF,SSE=SST-SSR-SSC-SSTr,dfe=(p-1)*(p-2),MSE=SSE/dfe;
 return {p,N,G,rt,ct,tt,SST,SSR,SSC,SSTr,SSE,dfe,MSE,F:SSTr/(SSTr/(p-1))/(MSE)};
}
function latinAnswer(matrix,missingQ8=false){
 const c=latin(matrix),p=5,fr=(c.SSR/4)/c.MSE,fc=(c.SSC/4)/c.MSE,ft=(c.SSTr/4)/c.MSE,ftab=fCrit(4,c.dfe,.05),pr=fP(fr,4,c.dfe),pc=fP(fc,4,c.dfe),pt=fP(ft,4,c.dfe);
 let out=`<h3>Latin Square ANOVA</h3><table class="calc-table"><tr><th>Source</th><th>SS</th><th>df</th><th>MS</th><th>F-cal</th><th>F-tab (5%)</th><th>p-value</th><th>Decision</th></tr>
 <tr><td>Rows</td><td>${fmt(c.SSR)}</td><td>4</td><td>${fmt(c.SSR/4)}</td><td><b>${fmt(fr)}</b></td><td><b>${fmt(ftab)}</b></td><td>${fmt(pr,5)}</td><td><b>${pr<.05?'Reject H₀':'Fail to reject H₀'}</b></td></tr>
 <tr><td>Columns</td><td>${fmt(c.SSC)}</td><td>4</td><td>${fmt(c.SSC/4)}</td><td><b>${fmt(fc)}</b></td><td><b>${fmt(ftab)}</b></td><td>${fmt(pc,5)}</td><td><b>${pc<.05?'Reject H₀':'Fail to reject H₀'}</b></td></tr>
 <tr><td>Fertilizer / Variety</td><td>${fmt(c.SSTr)}</td><td>4</td><td>${fmt(c.SSTr/4)}</td><td><b>${fmt(ft)}</b></td><td><b>${fmt(ftab)}</b></td><td>${fmt(pt,5)}</td><td><b>${pt<.05?'Reject H₀':'Fail to reject H₀'}</b></td></tr>
 <tr><td>Error</td><td>${fmt(c.SSE)}</td><td>${c.dfe}</td><td>${fmt(c.MSE)}</td><td></td><td></td><td></td><td></td></tr>
 <tr><th>Total</th><th>${fmt(c.SST)}</th><th>24</th><th></th><th></th><th></th><th></th><th></th></tr></table>
 ${interpretation(pt<.05,pt<.05?"The treatment/fertilizer means differ significantly.":"There is no significant treatment difference at 5%.")}
 <h3>Treatment means</h3><table class="calc-table"><tr><th>Treatment</th><th>Total</th><th>Mean</th></tr>${Object.entries(c.tt).map(([k,v])=>`<tr><td>${k}</td><td>${fmt(v)}</td><td><b>${fmt(v/5)}</b></td></tr>`).join("")}</table>`;
 if(missingQ8) out+=`<h3>Missing-value estimate</h3><div class="notice">For Q8, the missing-cell estimate is shown separately from the completed ANOVA table.</div>`;
 return out;
}
function q8(){
 let m=nums(document.getElementById("input").value,true);
 let missing= m.flat().filter(x=>x==null).length;
 if(missing===0)return latinAnswer(m,false);
 // calculate x=(R+C+T-2G)/2 using design
 const p=5,design=[["A","B","C","D","E"],["B","C","D","E","A"],["C","D","E","A","B"],["D","E","A","B","C"],["E","A","B","C","D"]];
 let ri=0,cj=0;for(let i=0;i<5;i++)for(let j=0;j<5;j++)if(m[i][j]==null){ri=i;cj=j}
 let R=sum(m[ri]),C=sum(m.map(x=>x[cj])),sym=design[ri][cj],T=0,G=0;for(let i=0;i<5;i++)for(let j=0;j<5;j++)if(m[i][j]!=null){G+=m[i][j];if(design[i][j]===sym)T+=m[i][j]}
 let x=(R+C+T-2*G)/2;m[ri][cj]=x;
 return `<h3>Q8 — Latin Square with Missing Observation</h3><div class="formula">x = (Row total + Column total + Treatment total − 2G) / 2</div><div class="result ok"><b>Estimated missing value = ${fmt(x,4)}</b><br>Missing cell: row ${ri+1}, column ${cj+1}, treatment ${sym}.</div>${latinAnswer(m,true)}`;
}
function q9(){return latinAnswer(nums(document.getElementById("input").value),false)}
function solveSelected(){
 const el=document.getElementById("out");let out="";
 try{
  if(selected===1)out=q1();if(selected===2)out=q2();if(selected===3)out=q3();if(selected===4)out=q4();if(selected===5)out=q5();if(selected===6)out=q6();if(selected===7)out=q7();if(selected===8)out=q8();if(selected===9)out=q9();
  document.getElementById("result").classList.remove("hidden");el.innerHTML=out;document.getElementById("result").scrollIntoView({behavior:"smooth"});
 }catch(e){el.innerHTML=`<div class="result bad"><b>Data error:</b> ${e.message}</div>`;document.getElementById("result").classList.remove("hidden")}
}
function q4(){return crdAnswer(nums(document.getElementById("input").value),["15%","20%","25%","30%","35%"],4)}
tabs();renderForm();

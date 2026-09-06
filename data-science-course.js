/* Statistical Hub — Research + Data Science Master Course */
const DS_PHASES=[
{n:1,name:'Research & Data Fundamentals',range:[1,10],topics:['Research fundamentals','Research questions and objectives','Hypothesis and variables','Measurement scales','Population and sample','Sampling methods','Data types and sources','Questionnaire and scale design','Data collection and ethics','Research data workflow']},
{n:2,name:'Excel for Research & Data Analysis',range:[11,30],topics:['Excel fundamentals','Data entry and validation','Formulas and references','Logical functions','Text and cleaning functions','Date and time functions','Lookup functions','Conditional aggregation','Sorting and filtering','Tables and structured references','Pivot Tables','Pivot Charts','Descriptive statistics','Correlation in Excel','Regression in Excel','ANOVA in Excel','Research reporting in Excel','Data-cleaning project','Analysis project','Research dashboard']},
{n:3,name:'R for Statistics & Research',range:[31,55],topics:['R and RStudio','Objects and vectors','Matrices and lists','Data frames and factors','Functions and packages','Import and export','Base R cleaning','dplyr','tidyr','ggplot2','Descriptive statistics','Probability','Probability distributions','Sampling and estimation','Hypothesis testing','Correlation','Regression','ANOVA','Non-parametric tests','Multivariate analysis','Model diagnostics','Reproducible research','R Markdown','Research visualization','Complete R project']},
{n:4,name:'Python for Data Science',range:[56,75],topics:['Python setup and workflow','Variables and data types','Data structures','Conditions and loops','Functions and modules','NumPy','Pandas','Data import','Data cleaning','Missing values','Outliers','Transformation','Matplotlib','Seaborn','EDA','Statistics with Python','Regression','Classification','Model evaluation','Complete Python project']},
{n:5,name:'SQL for Data Analysis',range:[76,90],topics:['Database fundamentals','Tables and relationships','SELECT and WHERE','ORDER BY and DISTINCT','GROUP BY and HAVING','Aggregate functions','JOINs','Multi-table research queries','Subqueries','CTEs','CASE expressions','Window functions','Data-quality queries','Analytical datasets','SQL research project']},
{n:6,name:'SPSS for Academic Research',range:[91,105],topics:['SPSS interface','Variable View and Data View','Coding and labels','Missing values','Data cleaning','Descriptives and Explore','Crosstabs and chi-square','Independent t-test','Paired t-test','One-way ANOVA','Two-way ANOVA','Correlation','Regression','Non-parametric tests','Reliability and research reporting']},
{n:7,name:'Additional Research Software',range:[106,115],topics:['Stata workflow','Stata data management','Stata descriptive analysis','Stata regression','Stata diagnostics','EViews econometrics','Jamovi','JASP','G*Power','Cross-software verification']},
{n:8,name:'Visualization & Business Intelligence',range:[116,120],topics:['Visualization principles','Power BI and data import','Power Query','DAX and data models','Tableau and research dashboards']},
{n:9,name:'Advanced Statistics & Research Analysis',range:[121,130],topics:['Estimation and confidence intervals','Sample size and power','Hypothesis testing','ANOVA and effect sizes','Partial correlation','Multiple regression','Regression diagnostics','Logistic regression','Multivariate analysis','PCA, factor and cluster analysis']},
{n:10,name:'SEM, Machine Learning & Research Projects',range:[131,140],topics:['SmartPLS and PLS-SEM','Constructs and indicators','Reflective and formative models','Measurement model','Structural model','Bootstrapping and hypotheses','Mediation and moderation','Machine learning fundamentals','Classification and clustering','End-to-end research project']}
];
const DS_DOMAINS=['Education','Public health','Agriculture','Economics','Business','Psychology','Environmental science','Biological science','Medical research','Survey research'];
const DS_TOOLS={1:'Research methodology',2:'Microsoft Excel',3:'R / RStudio',4:'Python',5:'SQL',6:'SPSS',7:'Stata / EViews / Jamovi / JASP / G*Power',8:'Power BI / Tableau',9:'R / SPSS / Stata',10:'SmartPLS / Python'};
const DS_TITLES=[];let dsNo=1;DS_PHASES.forEach(p=>{if(p.topics.length!==p.range[1]-p.range[0]+1)throw new Error(`Phase ${p.n} topic count does not match class range`);p.topics.forEach(t=>DS_TITLES.push({id:dsNo,title:t,phase:p.n,phaseName:p.name,tool:DS_TOOLS[p.n]}),dsNo++)});
if(DS_TITLES.length!==140)throw new Error(`Course must contain exactly 140 classes; found ${DS_TITLES.length}`);
function dsClass(id){return DS_TITLES.find(x=>x.id===Number(id));}
function dsStorage(){try{return JSON.parse(localStorage.getItem('stacal_ds_progress')||'{}')}catch(e){return {}}}
function dsSave(x){localStorage.setItem('stacal_ds_progress',JSON.stringify(x))}
function dsIsPassed(id){return !!dsStorage()[id]?.passed}
function dsUnlocked(id){id=Number(id);return id===1||dsIsPassed(id-1)}
function dsExamTopics(c){const p=DS_PHASES.find(x=>x.n===c.phase),idx=c.id-p.range[0],before=p.topics.slice(Math.max(0,idx-2),idx),current=[c.title];return [...before,...current].filter((v,i,a)=>a.indexOf(v)===i)}
function dsCalcSeed(c,i){return ((c.id*17+i*13)%37)+8}
function dsQuestionBank(c){const bank=[],topics=dsExamTopics(c);const add=(type,q,opts,ans,exp,topic)=>bank.push({id:`${c.id}-${bank.length+1}`,type,q,opts,ans,exp,topic:topic||c.title});for(let i=0;i<50;i++){const d=DS_DOMAINS[i%DS_DOMAINS.length],topic=topics[i%topics.length],seed=dsCalcSeed(c,i),v=i%5;if(v===0)add('Basic',`Which statement best describes “${topic}” in a ${d.toLowerCase()} research study?`,['It should be understood and applied in relation to the research question and data','It is only a software shortcut','It removes the need for interpretation','It guarantees a significant result'],0,'The topic must be connected to the research question, data and appropriate interpretation.',topic);else if(v===1){const a=seed,b=(i%7)+2,ans=a+b;add('Calculation',`A researcher records ${a} observations and then adds ${b} more. What is the total number of observations?`,[String(ans-1),String(ans),String(ans+1),String(ans+2)],1,`Add the original observations and the new observations: ${a} + ${b} = ${ans}.`,topic)}else if(v===2)add('Application',`A ${d.toLowerCase()} researcher is applying “${topic}”. What should be done first?`,['Define the research question, variables and data requirements','Run every available test','Delete all unusual values automatically','Write the conclusion before analysing data'],0,'Research-first analysis begins by defining the question and understanding the data.',topic);else if(v===3){const x=seed,y=(i%6)+2,mean=(x+y)/2;add('Calculation',`Two measurements are ${x} and ${y}. What is their arithmetic mean?`,[mean.toFixed(1),String(x+y),(x-y).toFixed(1),y.toFixed(1)],0,`Mean = (x + y) / 2 = (${x} + ${y}) / 2 = ${mean.toFixed(1)}.`,topic)}else add('Interpretation',`After analysing “${topic}”, which reporting practice is most appropriate?`,['Report the result with context, assumptions/limitations and an appropriate interpretation','Report only the software output','Hide missing-data decisions','Change the hypothesis after seeing the result'],0,'Good research reporting explains what the result means, under what assumptions, and what limitations remain.',topic)}return bank}
function dsClassContent(c){const domains=[DS_DOMAINS[(c.id-1)%10],DS_DOMAINS[c.id%10],DS_DOMAINS[(c.id+3)%10]],topics=dsExamTopics(c);const steps=[`Step 1 — Define the research question and identify the variables relevant to ${c.title}.`,`Step 2 — Prepare/check the dataset: variable types, coding, missing values and obvious data-quality problems.`,`Step 3 — Select the appropriate method/tool (${c.tool}) and state the assumptions or conditions that matter.`,`Step 4 — Perform the analysis using the provided data and record the key output.`,`Step 5 — Verify the result with a sensible check (formula, alternative calculation, diagnostic or cross-software check where applicable).`,`Step 6 — Interpret the finding in the research context; distinguish statistical output from substantive meaning.`,`Step 7 — Write a concise research-ready result statement and mention important limitations.`];return {objectives:[`Explain the core ideas of ${c.title}.`,`Apply ${c.title} to a realistic research problem.`,`Use ${c.tool} appropriately and interpret the output.`,`Report findings clearly and identify important limitations.`],examTopics:topics,theory:`${c.title} is taught through a research-first workflow. You will learn the concept, identify the research question and variables, prepare the data, choose the appropriate method/tool, perform and verify the analysis, interpret the result, and report it transparently.`,examples:domains.map((d,i)=>({domain:d,problem:`A researcher in ${d.toLowerCase()} wants to answer a practical question related to ${c.title}.`,data:`Synthetic Research Dataset ${c.id}.${i+1}: relevant observations prepared for practice.`,analysis:`Apply ${c.tool} to the question, documenting preparation, method choice and assumptions.`,result:`Produce the relevant statistic/table/model/query/chart/output and check whether it is sensible.`,interpretation:`Explain what the result means for the ${d.toLowerCase()} research question and what it does not establish.`})),steps,practice:`Complete the example from the dataset yourself, change at least one input/condition, verify the result independently, and write a 150–250 word interpretation.`,reporting:`State the research purpose, variables/data, method and tool, key numerical or analytical result, uncertainty/assumptions where relevant, and a context-specific interpretation.`,examMix:`The 20-question mastery test is mixed: basic concepts + applied research scenarios + calculation/numerical questions + output interpretation + decision questions. Questions are selected from a 50-question bank and randomized on each attempt.`}}
function dsDatasetCSV(c){const rows=['id,group,age,score,exposure,outcome'];for(let i=1;i<=30;i++)rows.push(`${i},${i%3===0?'B':'A'},${18+(i%25)},${50+(i*7+c.id)%48},${(i%10)+1},${(i*3+c.id)%20}`);return rows.join('\n')}
if(window.DS_PHASES===undefined)window.DS_PHASES=DS_PHASES;

/* Exam engine enhancement: 30-minute timed mastery tests + reset/new-question control. */
(function(){
  const EXAM_MINUTES=30, EXAM_SECONDS=EXAM_MINUTES*60;
  let examTimerId=null, examDeadline=0, examSubmitted=false, observerStarted=false;
  function stopTimer(){if(examTimerId!==null){clearInterval(examTimerId);examTimerId=null}}
  function formatTime(s){const m=Math.floor(s/60),sec=s%60;return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`}
  function timerBox(){return document.getElementById('dsExamTimer')}
  function updateTimer(){const el=timerBox();if(!el)return;const left=Math.max(0,Math.ceil((examDeadline-Date.now())/1000));el.textContent=`⏱ Time Left: ${formatTime(left)}`;if(left<=300){el.style.background='#ffe8e8';el.style.color='#b42318';el.style.borderColor='#f0a3a3'}if(left<=0){stopTimer();const submit=document.getElementById('submit');if(submit&&!examSubmitted){submit.dataset.auto='1';submit.click()}}}
  function startTimer(){stopTimer();examSubmitted=false;examDeadline=Date.now()+EXAM_SECONDS*1000;updateTimer();examTimerId=setInterval(updateTimer,1000)}
  function resetExam(){
    stopTimer();
    const result=document.getElementById('testResult');if(result){result.innerHTML='';result.className='result'}
    const submit=document.getElementById('submit'),retake=document.getElementById('retake');
    if(submit){submit.style.display='inline-block';submit.disabled=false;delete submit.dataset.auto;delete submit.dataset.enhanced}
    if(retake)retake.style.display='none';
    /* Reuse the existing course engine so its question-bank and anti-repeat logic remain intact. */
    startTest();
    setTimeout(()=>{bindControls();startTimer()},0);
  }
  function bindControls(){
    const submit=document.getElementById('submit'),retake=document.getElementById('retake');if(!submit||!retake)return;
    submit.dataset.enhanced='1';
    submit.onclick=function(){if(examSubmitted)return;examSubmitted=true;stopTimer();submitTest()};
    retake.textContent='🔄 Reset / New Questions';
    retake.onclick=function(){resetExam()};
  }
  function mountExamUI(){
    const test=document.querySelector('.test');if(!test)return;
    let h=test.querySelector('#dsExamTimer');
    if(!h){const title=test.querySelector('h2');h=document.createElement('div');h.id='dsExamTimer';h.setAttribute('role','timer');h.style.cssText='display:inline-block;margin:8px 0 12px;padding:10px 14px;border-radius:10px;background:#fff4e5;border:1px solid #f2c98b;color:#9a4d00;font-size:18px;font-weight:800';if(title)title.insertAdjacentElement('afterend',h)}
    const small=test.querySelector('.small');if(small&&!small.dataset.timerNote){small.dataset.timerNote='1';small.innerHTML+=' <strong>Time limit: 30 minutes.</strong> When the timer reaches 00:00, the test is submitted automatically.'}
    bindControls();startTimer();
  }
  function observe(){
    if(observerStarted)return;observerStarted=true;
    const content=document.getElementById('content');if(!content)return;
    const mo=new MutationObserver(()=>{const submit=document.getElementById('submit');if(submit&&!submit.dataset.enhanced){setTimeout(mountExamUI,0)}});
    mo.observe(content,{childList:true,subtree:true});
    setTimeout(mountExamUI,0);
  }
  function boot(){observe();window.addEventListener('beforeunload',stopTimer)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();

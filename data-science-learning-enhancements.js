/* Statistical Hub — Data Science Academy Learning + Dataset Lab enhancement layer
   ADD-ONLY layer: keeps the existing 140-class course, exam engine, roadmap and URLs intact.
   Adds explicit study mapping, dataset tasks, mathematical worked calculations and research reporting guidance.
*/
(function(){
  const S={
    'Research fundamentals':['What research is','Purpose and importance of research','Types of research','Research process/cycle','Research problem identification','Research questions','Research objectives','Population and sample','Primary vs secondary data','Research ethics','Basic research reporting'],
    'Research questions and objectives':['Research problem vs research question','Characteristics of a good research question','Descriptive vs analytical questions','Research objectives','General and specific objectives','Alignment among problem, questions and objectives','Feasibility and scope','Operational definitions','Researchable vs non-researchable questions','Turning questions into analysis tasks'],
    'Hypothesis and variables':['Concept and purpose of a hypothesis','Null and alternative hypotheses','Directional vs non-directional hypotheses','Independent and dependent variables','Control/confounding variables','Mediators and moderators','Operationalization','Variable coding','Hypothesis-test alignment','Research interpretation'],
    'Measurement scales':['Nominal scale','Ordinal scale','Interval scale','Ratio scale','Discrete vs continuous variables','Categorical vs numerical variables','Units of measurement','Coding schemes','Appropriate summaries by scale','Choosing graphs/tests from measurement level'],
    'Population and sample':['Target population','Accessible population','Sampling frame','Sample','Census vs sample','Sampling error','Representativeness','Inclusion/exclusion criteria','Sample size basics','Generalization and limitations'],
    'Sampling methods':['Probability vs non-probability sampling','Simple random sampling','Systematic sampling','Stratified sampling','Cluster sampling','Multistage sampling','Convenience sampling','Purposive sampling','Quota sampling','Selection bias','When each method is appropriate'],
    'Data types and sources':['Primary data','Secondary data','Quantitative data','Qualitative data','Cross-sectional data','Longitudinal data','Structured datasets','Data provenance','Variable types','Missing and invalid data','Data-quality documentation'],
    'Questionnaire and scale design':['Constructs and indicators','Open vs closed questions','Likert scales','Balanced response options','Leading questions','Double-barrelled questions','Reverse-coded items','Pilot testing','Reliability and validity introduction','Questionnaire coding'],
    'Data collection and ethics':['Consent','Confidentiality','Anonymity','Data minimization','Secure storage','Researcher responsibility','Data collection protocols','Bias during collection','Missing responses','Ethical reporting'],
    'Research data workflow':['Research question','Study design','Data dictionary','Collection','Cleaning','Exploratory analysis','Statistical analysis','Validation','Interpretation','Reporting','Reproducibility'],
    'Excel fundamentals':['Workbook/worksheet structure','Cells and ranges','Relative and absolute references','Basic formulas','Formatting for analysis','Named ranges','Data types','Sorting basics','Common errors','Research spreadsheet organization'],
    'Data entry and validation':['Consistent coding','Data validation rules','Drop-down lists','Numeric/date validation','Duplicate detection','Missing-value codes','Input errors','Protected formulas','Data dictionaries','Quality checks'],
    'Formulas and references':['Arithmetic operators','Relative references','Absolute references','Mixed references','SUM','AVERAGE','MIN/MAX','COUNT/COUNTA','Formula auditing','Error checking'],
    'Logical functions':['IF','IFS','AND','OR','NOT','Nested logic','Conditional classification','Error handling','Research decision rules','Validation of logical outputs'],
    'Text and cleaning functions':['TRIM','CLEAN','LEFT/RIGHT/MID','LEN','UPPER/LOWER','SUBSTITUTE','CONCAT/TEXTJOIN','Text-to-columns','Standardizing categories','Detecting inconsistent labels'],
    'Date and time functions':['Date serials','TODAY/NOW','YEAR/MONTH/DAY','DATEDIF','Date subtraction','Study duration','Follow-up time','Period grouping','Date validation','Research timelines'],
    'Lookup functions':['XLOOKUP','VLOOKUP','INDEX/MATCH','Exact vs approximate match','Lookup keys','Reference tables','Handling unmatched records','Joining datasets conceptually','Validation of lookups','Research coding maps'],
    'Conditional aggregation':['SUMIF/SUMIFS','COUNTIF/COUNTIFS','AVERAGEIF/AVERAGEIFS','Multiple criteria','Group summaries','Subgroup analysis','Missing-value effects','Cross-checking totals','Research tables'],
    'Sorting and filtering':['Single/multi-column sort','Custom sort','Filters','Advanced filters','Subgroup selection','Outlier review','Temporary vs permanent changes','Avoiding accidental data loss','Research subset creation'],
    'Tables and structured references':['Excel Tables','Structured references','Calculated columns','Automatic expansion','Table filters','Totals row','Data integrity','Reusable analysis ranges'],
    'Pivot Tables':['Rows/columns/values/filters','Count vs sum','Average by group','Grouping','Calculated fields basics','Missing categories','Cross-tabulation','Research summary tables'],
    'Pivot Charts':['Choosing chart type','Bar/column charts','Line charts','Scatter plots','Chart filters','Titles and labels','Avoiding misleading charts','Research visualization'],
    'Descriptive statistics':['Mean','Median','Mode','Range','Variance','Standard deviation','Quartiles','IQR','Coefficient of variation','Skewness','Outlier interpretation'],
    'Correlation in Excel':['Covariance','Pearson correlation','Correlation coefficient range','Scatter plot','Significance concept','Direction and strength','Outliers','Correlation vs causation','Interpretation'],
    'Regression in Excel':['Simple linear regression','Predictor/outcome','Slope','Intercept','Residuals','R-squared','ANOVA table','Coefficient significance','Prediction','Assumptions','Research reporting'],
    'ANOVA in Excel':['Between-group variation','Within-group variation','SS total','SS treatment','SS error','Degrees of freedom','Mean squares','F statistic','p-value','Post-hoc concept','Effect size'],
    'Research reporting in Excel':['Research tables','Descriptive summaries','Figures','Rounding','Units','Notes and sources','Interpretation','Reproducible workbook structure'],
    'Data-cleaning project':['Data dictionary','Missing values','Duplicates','Invalid values','Outliers','Inconsistent labels','Derived variables','Validation checks','Clean-data export'],
    'Analysis project':['Research question','Variable selection','Descriptive analysis','Visualization','Inferential method','Assumption checks','Interpretation','Research report'],
    'Research dashboard':['KPI selection','Filters','Summary cards','Charts','User interaction','Data refresh','Visual hierarchy','Research storytelling','Dashboard validation'],
    'R and RStudio':['R/RStudio interface','Scripts vs console','Objects','Packages','Working directory','Help system','Vectors','Basic expressions','Reproducible scripts'],
    'Objects and vectors':['Atomic vectors','Numeric/character/logical','Indexing','Vectorized operations','Sequences','Missing values','Factors introduction','Length and attributes'],
    'Matrices and lists':['Matrix creation','Dimensions','Indexing','Matrix arithmetic','Lists','Nested objects','Apply family introduction','Use cases'],
    'Data frames and factors':['Data-frame structure','Rows/columns','Factors','Levels','Variable classes','Indexing','Type conversion','Summary methods'],
    'Functions and packages':['Function syntax','Arguments','Return values','Built-in functions','CRAN packages','library/require','Documentation','Reusable analysis functions'],
    'Import and export':['read.csv/readr','Excel import concept','File paths','Encoding','Exporting CSV','Data integrity checks','Reproducible paths'],
    'Base R cleaning':['Missing values','Duplicates','Type conversion','Filtering','Recoding','Renaming','Derived variables','Validation'],
    'dplyr':['select','filter','mutate','arrange','summarise','group_by','across','pipe','Grouped research summaries'],
    'tidyr':['pivot_longer','pivot_wider','separate','unite','Missing structure','Tidy-data principles','Long vs wide data'],
    'ggplot2':['Grammar of graphics','Aesthetics','Geoms','Facets','Scales','Labels','Themes concept','Research-ready figures'],
    'Descriptive statistics':['Mean','Median','Mode','Variance','Standard deviation','Quantiles','IQR','Skewness','Grouped summaries','Interpretation'],
    'Probability':['Sample space','Events','Addition rule','Multiplication rule','Conditional probability','Independence','Bayes concept','Expected value'],
    'Probability distributions':['PMF/PDF','CDF','Parameters','Binomial','Poisson','Normal','Expected value','Variance','Simulation','Distribution selection'],
    'Sampling and estimation':['Sampling distribution','Point estimate','Standard error','Confidence interval','Mean/proportion estimation','Margin of error','Interpretation'],
    'Hypothesis testing':['Null/alternative hypotheses','Test statistic','Critical region','p-value','Type I/II error','Power','One/two-sided tests','Decision rule','Effect vs significance'],
    'Correlation':['Pearson r','Spearman rho','Covariance','Scatter plot','Hypothesis test','Confidence interval concept','Outliers','Correlation vs causation'],
    'Regression':['Linear model','Slope/intercept','OLS idea','Residuals','R-squared','Adjusted R-squared','Coefficient tests','Prediction','Assumptions','Diagnostics'],
    'ANOVA':['CRD concept','SS decomposition','df','MS','F statistic','p-value','Effect size','Post-hoc tests','Assumptions','Interpretation'],
    'Non-parametric tests':['Rank-based methods','Mann-Whitney U','Wilcoxon signed-rank','Kruskal-Wallis','Spearman correlation','Assumptions','When to use','Interpretation'],
    'Multivariate analysis':['Multiple variables','Covariance matrix','Multivariate response','Dimension reduction','Multivariate inference','Interpretation','Assumptions'],
    'Model diagnostics':['Residual analysis','Linearity','Normality','Homoscedasticity','Multicollinearity','Influence','Outliers','Diagnostic plots','Remedies'],
    'Reproducible research':['Project structure','Scripted analysis','Seeds','Package versions','Data provenance','Automated outputs','Documentation','Reproducibility checklist'],
    'R Markdown':['Markdown syntax','Code chunks','Inline code','Tables','Figures','Parameters concept','HTML/PDF reporting','Reproducibility'],
    'Research visualization':['Question-first plotting','Distribution plots','Relationship plots','Group comparisons','Uncertainty','Annotation','Color/scale choices','Accessibility','Publication-ready output'],
    'Complete R project':['Research question','Data import','Cleaning','EDA','Statistical analysis','Visualization','Diagnostics','Reporting','Reproducible project'],
    'Python setup and workflow':['Python environment','Jupyter/IDE','Scripts','Variables','Packages','Virtual environments concept','Reproducibility','Project structure'],
    'Variables and data types':['Integers/floats','Strings','Booleans','None','Type conversion','Operators','Input/output','Data validation'],
    'Data structures':['Lists','Tuples','Dictionaries','Sets','Indexing','Slicing','Nested structures','Use in data analysis'],
    'Conditions and loops':['if/elif/else','for','while','range','break/continue','Comprehensions','Validation loops','Automation'],
    'Functions and modules':['def','Parameters','Return','Scope','Modules','Imports','Reusable analysis code','Error handling'],
    'NumPy':['Arrays','Shape','Indexing','Vectorization','Aggregations','Random numbers','Mean/SD','Matrix operations'],
    'Pandas':['Series','DataFrame','Index','Selection','groupby','aggregation','merge','sorting','missing data'],
    'Data import':['CSV','Excel','Paths','Encodings','Schema inspection','Data types','Export'],
    'Data cleaning':['Duplicates','Missing values','Invalid values','Type conversion','Recoding','Outliers','Validation'],
    'Missing values':['MCAR/MAR/MNAR concept','Detection','Missingness summaries','Deletion','Imputation concept','Sensitivity','Reporting'],
    'Outliers':['Definition','IQR rule','Z-scores','Visual detection','Influential observations','Data errors vs true extremes','Treatment choices'],
    'Transformation':['Log','Square root','Standardization','Normalization','Encoding','Derived variables','Interpretation after transformation'],
    'Matplotlib':['Figure/axes','Line','Bar','Histogram','Scatter','Labels','Legends','Saving figures','Research presentation'],
    'Seaborn':['Statistical plots','Boxplot','Violinplot','Scatter/regression','Heatmap','Grouping','Research visualization'],
    'EDA':['Data profiling','Univariate analysis','Bivariate analysis','Missingness','Outliers','Distributions','Relationships','Hypothesis generation'],
    'Statistics with Python':['Descriptive statistics','Probability','Confidence intervals','Hypothesis tests','Correlation','Effect sizes','Interpretation'],
    'Classification':['Target variable','Features','Train/test split','Logistic classification','Decision trees concept','Confusion matrix','Precision/recall','ROC-AUC','Overfitting'],
    'Model evaluation':['Train/validation/test','Cross-validation','MAE','MSE','RMSE','R-squared','Accuracy','Precision','Recall','F1','ROC-AUC'],
    'Complete Python project':['Research question','Data import','Cleaning','EDA','Modeling','Evaluation','Visualization','Interpretation','Reproducible report'],
    'Database fundamentals':['Database vs spreadsheet','Rows/columns','Primary keys','Data types','Normalization concept','Relational thinking'],
    'Tables and relationships':['Primary/foreign keys','One-to-one','One-to-many','Many-to-many concept','Referential integrity','Join logic'],
    'SELECT and WHERE':['SELECT','FROM','WHERE','Comparison operators','AND/OR/NOT','NULL','Filtering research records'],
    'ORDER BY and DISTINCT':['Sorting','ASC/DESC','DISTINCT','Top/bottom records','Research data inspection'],
    'GROUP BY and HAVING':['Grouping','Aggregate summaries','HAVING','Subgroup research questions'],
    'Aggregate functions':['COUNT','SUM','AVG','MIN','MAX','NULL behavior','Grouped aggregation','Research summaries'],
    'JOINs':['INNER JOIN','LEFT JOIN','RIGHT/FULL concept','Join keys','Duplicate multiplication','Missing matches','Research data integration'],
    'Multi-table research queries':['Join multiple tables','Filter before/after join','Aggregation after join','Validation totals','Research cohort construction'],
    'Subqueries':['Scalar subquery','IN','EXISTS','Correlated concept','Nested filtering','Research comparisons'],
    'CTEs':['WITH','Readable query blocks','Multiple CTEs','Reusable transformations','Analytical workflows'],
    'CASE expressions':['CASE WHEN','Categories','Derived variables','Conditional aggregation','Research classification'],
    'Window functions':['OVER','PARTITION BY','ORDER BY','ROW_NUMBER','RANK','LAG/LEAD','Running totals','Research longitudinal analysis'],
    'Data-quality queries':['Duplicate detection','NULL checks','Range checks','Referential integrity','Invalid categories','Quality reports'],
    'Analytical datasets':['Cohort definition','Feature selection','Aggregations','Derived variables','Data grain','Validation'],
    'SQL research project':['Research question','Schema inspection','Data extraction','Cleaning logic','Analysis query','Validation','Interpretation'],
    'SPSS interface':['SPSS workflow','Menus','Output Viewer','Syntax','Data Editor','Saving outputs','Reproducibility'],
    'Variable View and Data View':['Name','Type','Width','Decimals','Label','Values','Missing','Measure','Role','Data View'],
    'Coding and labels':['Value labels','Reference categories','Numeric coding','String coding','Recoding','Documentation'],
    'Missing values':['System/user missing','Detection','Patterns','Valid percent','Listwise/pairwise concept','Reporting'],
    'Data cleaning':['Duplicates','Range checks','Outliers','Recoding','Compute variable','Validation','Clean dataset'],
    'Descriptives and Explore':['Frequencies','Descriptives','Explore','Mean/median','SD','Boxplots','Normality diagnostics'],
    'Crosstabs and chi-square':['Contingency tables','Expected counts','Chi-square statistic','Degrees of freedom','p-value','Effect size','Assumptions'],
    'Independent t-test':['Group means','Mean difference','Standard error','t statistic','df','p-value','Confidence interval','Effect size','Assumptions'],
    'Paired t-test':['Paired observations','Difference scores','Mean difference','SD of differences','t statistic','df','p-value','CI'],
    'One-way ANOVA':['Groups','Grand mean','SS between','SS within','df','MS','F','p-value','Post-hoc','Effect size'],
    'Two-way ANOVA':['Factors','Main effects','Interaction','SS','df','MS','F','Interpretation','Post-hoc concept'],
    'Correlation':['Pearson correlation','Significance','Confidence interval concept','Scatterplot','Outliers','Interpretation'],
    'Regression':['Linear regression','Coefficients','R/R²','ANOVA table','Residuals','Prediction','Assumptions','Diagnostics'],
    'Non-parametric tests':['Mann-Whitney','Wilcoxon','Kruskal-Wallis','Spearman','Rank statistics','Assumptions','Interpretation'],
    'Reliability and research reporting':['Cronbach alpha concept','Item-total relationships','Reliability vs validity','Reporting tables','Effect/significance distinction','Transparent methods'],
    'Stata workflow':['Do-file workflow','Data browser','Commands','Help','Log files','Reproducibility'],
    'Stata data management':['Import','generate','replace','rename','recode','label','drop/keep','merge','duplicates'],
    'Stata descriptive analysis':['summarize','tabulate','tabstat','graph','Group summaries','Interpretation'],
    'Stata regression':['regress','Coefficients','R²','Robust SE concept','Prediction','Diagnostics'],
    'Stata diagnostics':['Residuals','Heteroskedasticity','Multicollinearity','Influence','Specification checks'],
    'EViews econometrics':['Workfile','Series','Equation','Descriptive analysis','OLS','Diagnostics','Forecasting concept'],
    'Jamovi':['Data setup','Descriptives','t-tests','ANOVA','Correlation','Regression','Plots','Interpretation'],
    'JASP':['Data setup','Descriptives','t-tests','ANOVA','Regression','Bayesian concept','Plots','Reporting'],
    'G*Power':['Power','Alpha','Effect size','Sample size','Power curves','Study design'],
    'Cross-software verification':['Same dataset','Same variable coding','Same model specification','Numerical comparison','Rounding','Interpretation consistency'],
    'Visualization principles':['Purpose','Chart selection','Distribution vs relationship','Scale','Labels','Uncertainty','Accessibility','Avoiding misleading graphics'],
    'Power BI and data import':['Power BI interface','Import','Power Query basics','Data types','Relationships','Visuals','Filters'],
    'Power Query':['Transform','Clean','Merge','Append','Group by','Refresh','Query steps'],
    'DAX and data models':['Measures','Calculated columns','Filter context','CALCULATE concept','Relationships','KPIs'],
    'Tableau and research dashboards':['Dimensions/measures','Filters','Calculated fields','Charts','Dashboards','Research storytelling'],
    'Estimation and confidence intervals':['Point estimates','Standard error','Confidence interval','Margin of error','Mean/proportion','Interpretation'],
    'Sample size and power':['Alpha','Power','Effect size','Sample size','Type II error','Study design','G*Power'],
    'Hypothesis testing':['Null/alternative','Test statistic','p-value','Critical value','Errors','Power','Effect size','Decision and interpretation'],
    'ANOVA and effect sizes':['ANOVA decomposition','F statistic','p-value','Eta squared','Partial eta squared','Post-hoc','Practical significance'],
    'Partial correlation':['Pearson correlation','Control variable','Residualization concept','Partial r','Interpretation','Assumptions'],
    'Multiple regression':['Multiple predictors','Coefficients','Partial effects','R²/adjusted R²','F test','Multicollinearity','Prediction','Assumptions'],
    'Regression diagnostics':['Linearity','Normality','Homoscedasticity','Independence','VIF','Leverage','Cook distance','Remedies'],
    'Logistic regression':['Binary outcome','Logit','Odds','Odds ratio','Coefficients','Predicted probability','Classification','Model fit'],
    'PCA, factor and cluster analysis':['Covariance/correlation matrix','Eigenvalues','Explained variance','Loadings','Factors','Standardization','Distance','Clustering'],
    'SmartPLS and PLS-SEM':['SEM overview','PLS-SEM purpose','Latent constructs','Indicators','Model specification','Path model','Research hypotheses'],
    'Constructs and indicators':['Latent vs observed variables','Indicators','Operationalization','Construct validity','Indicator coding','Measurement design'],
    'Reflective and formative models':['Reflective logic','Formative logic','Causality direction','Indicator removal','Collinearity','Specification errors'],
    'Measurement model':['Reliability','Convergent validity','Discriminant validity','Loadings','AVE','Composite reliability','HTMT'],
    'Structural model':['Path coefficients','R²','f²','Q² concept','Collinearity','Predictive relevance','Hypothesis testing'],
    'Bootstrapping and hypotheses':['Bootstrap samples','Standard errors','t values','Confidence intervals','p values','Path significance','Reporting'],
    'Mediation and moderation':['Direct effect','Indirect effect','Total effect','Mediation','Interaction term','Moderation','Conditional effects'],
    'Machine learning fundamentals':['Supervised vs unsupervised','Features/target','Train-test split','Overfitting','Bias-variance','Validation','Ethics'],
    'Classification':['Binary/multiclass classification','Logistic regression','Trees','Confusion matrix','Precision','Recall','F1','ROC-AUC'],
    'Clustering':['Distance','K-means','Hierarchical clustering','Choosing k','Cluster validation','Interpretation','Applications'],
    'End-to-end research project':['Research question','Data acquisition','Cleaning','EDA','Method selection','Modeling','Validation','Visualization','Interpretation','Research reporting']
  };
  const phaseFallback={
    1:['Research problem','Research design','Variables','Data collection','Sampling','Ethics','Data quality','Research reporting'],
    2:['Data structure','Cleaning','Formulas/functions','Summary analysis','Visualization','Validation','Interpretation','Research reporting'],
    3:['R syntax','Data management','Statistical method','Assumptions','Visualization','Verification','Interpretation','Reproducibility'],
    4:['Python syntax','Pandas/NumPy','Data cleaning','EDA','Statistics/modeling','Visualization','Evaluation','Interpretation'],
    5:['Relational data','SQL syntax','Filtering','Aggregation','Joins','Analytical queries','Data quality','Validation'],
    6:['SPSS data setup','Coding','Cleaning','Statistical procedure','Assumptions','Output interpretation','Reporting'],
    7:['Software workflow','Data preparation','Statistical analysis','Diagnostics','Output interpretation','Cross-software verification'],
    8:['Data import','Data transformation','Visual encoding','Interactive dashboards','Research storytelling','Validation'],
    9:['Statistical theory','Mathematical calculation','Assumptions','Test/model selection','Effect size','Interpretation','Research reporting'],
    10:['Research design','Model specification','Mathematical/statistical foundations','Model evaluation','Interpretation','Research reporting','Reproducibility']
  };
  function topics(c){return S[c.title]||phaseFallback[c.phase]||[c.title,'Definitions','Assumptions','Application','Calculation','Interpretation','Reporting'];}
  function csvValues(c){const csv=window.dsDatasetCSV(c),lines=csv.trim().split(/\r?\n/),h=lines[0].split(','),rows=lines.slice(1).map(x=>x.split(','));const ix=n=>h.indexOf(n);const nums=n=>rows.map(r=>Number(r[ix(n)])).filter(Number.isFinite);return {h,rows,age:nums('age'),score:nums('score'),exposure:nums('exposure'),outcome:nums('outcome'),groups:rows.map(r=>r[ix('group')]).filter(Boolean)};}
  const mean=a=>a.reduce((s,x)=>s+x,0)/a.length;
  const median=a=>{const x=[...a].sort((a,b)=>a-b),m=Math.floor(x.length/2);return x.length%2?x[m]:(x[m-1]+x[m])/2};
  const sd=a=>{const m=mean(a);return Math.sqrt(a.reduce((s,x)=>s+(x-m)**2,0)/(a.length-1));};
  const pearson=(x,y)=>{const mx=mean(x),my=mean(y);let a=0,b=0,c=0;for(let i=0;i<x.length;i++){a+=(x[i]-mx)*(y[i]-my);b+=(x[i]-mx)**2;c+=(y[i]-my)**2}return a/Math.sqrt(b*c)};
  function mathFor(c){const d=csvValues(c),n=d.score.length,m=mean(d.score),med=median(d.score),s=sd(d.score),min=Math.min(...d.score),max=Math.max(...d.score),r=pearson(d.exposure,d.score);const title=c.title.toLowerCase();let items=[];
    items.push({name:'Sample size',formula:'n = number of valid observations',calc:`n = ${n}`,answer:String(n),meaning:'There are '+n+' valid score observations in this practice dataset.'});
    if(/mean|descriptive|statistics|excel|r and rstudio|python|spss|data analysis|eda|fundamentals/.test(title))items.push({name:'Mean of score',formula:'x̄ = Σx / n',calc:`x̄ = ${d.score.reduce((a,b)=>a+b,0)} / ${n}`,answer:m.toFixed(3),meaning:'The average score in this synthetic dataset is '+m.toFixed(3)+'.'});
    if(/median|descriptive|statistics|excel|r and rstudio|python|spss|eda/.test(title))items.push({name:'Median of score',formula:'Median = middle ordered value (or average of two middle values)',calc:`Ordered score values are used; middle position is around ${(n+1)/2}.`,answer:med.toFixed(3),meaning:'Half of the observations are at or below the median and half are at or above it.'});
    if(/variance|standard deviation|descriptive|statistics|excel|r and rstudio|python|spss|eda|diagnostic/.test(title))items.push({name:'Sample standard deviation of score',formula:'s = √[Σ(x−x̄)²/(n−1)]',calc:`s = √[Σ(x−${m.toFixed(3)})² / (${n}−1)]`,answer:s.toFixed(3),meaning:'This measures the typical spread of scores around the sample mean.'});
    if(/correlation|regression|multiple regression|partial correlation|python|r for|spss|advanced/.test(title))items.push({name:'Pearson correlation: exposure vs score',formula:'r = Σ[(x−x̄)(y−ȳ)] / √[Σ(x−x̄)²Σ(y−ȳ)²]',calc:`Using all ${n} paired observations from exposure and score`,answer:r.toFixed(4),meaning:'The sign shows direction and the absolute value shows linear association strength; correlation alone does not establish causation.'});
    if(/regression|classification|machine learning/.test(title))items.push({name:'Simple regression slope: score on exposure',formula:'b₁ = Cov(X,Y) / Var(X) = r·sY/sX',calc:`b₁ = ${r.toFixed(4)} × ${s.toFixed(3)} / ${sd(d.exposure).toFixed(3)}`,answer:(r*s/sd(d.exposure)).toFixed(4),meaning:'For this practice dataset, the slope is the estimated change in score per one-unit increase in exposure.'});
    if(/percentage|proportion|sampling|response|data types|missing|quality|cleaning/.test(title)){const a=d.groups.filter(x=>x==='A').length;items.push({name:'Group A proportion',formula:'p = x/n',calc:`p = ${a}/${d.groups.length}`,answer:(a/d.groups.length*100).toFixed(2)+'%',meaning:'This is the percentage of valid records coded as group A.'});}
    if(/anova|two-way|one-way/.test(title)){items.push({name:'Score range',formula:'Range = max − min',calc:`Range = ${max} − ${min}`,answer:(max-min).toFixed(3),meaning:'The range describes the total spread from the smallest to largest observed score.'});}
    return items;
  }
  function taskFor(c){const t=c.title.toLowerCase();let tasks=['Download the class CSV dataset and inspect every variable before analysis.','Create a short data dictionary: variable name, type, unit/coding and role in the research question.','Check missing values, invalid values, duplicates and unusual observations; document every decision.'];
    if(/descriptive|statistics|mean|median/.test(t))tasks.push('Calculate mean, median, variance and standard deviation manually, then verify them in the course software.');
    if(/correlation/.test(t))tasks.push('Create a scatter plot, calculate Pearson correlation, test/interpret significance where applicable, and explain why correlation is not causation.');
    if(/regression/.test(t))tasks.push('Define predictor/outcome, fit the model, interpret coefficients and R², check assumptions, and write a research-ready conclusion.');
    if(/anova/.test(t))tasks.push('Identify the groups, calculate SS/df/MS/F conceptually or manually where feasible, verify in software, then interpret the result and post-hoc implications.');
    if(/hypothesis|t-test|chi-square|non-parametric/.test(t))tasks.push('State H0/H1, select the correct test, identify assumptions, calculate/inspect the test statistic and p-value, then make a statistical decision.');
    if(/excel/.test(t))tasks.push('Complete the analysis in Excel and independently verify at least one key result with a hand calculation.');
    if(/r and rstudio|^r |python|pandas|numpy/.test(t))tasks.push('Reproduce the analysis in code and save the script/notebook so another researcher can rerun it.');
    if(/sql/.test(t))tasks.push('Write the SQL query that produces the analysis-ready subset/summary, then validate row counts and totals against the raw data.');
    if(/spss/.test(t))tasks.push('Set up Variable View correctly, run the procedure, inspect Output Viewer tables/plots, and report the result in research language.');
    if(/smartpls|sem|mediation|moderation/.test(t))tasks.push('Specify the research model, define constructs/indicators, evaluate the measurement/structural model as applicable, and report paths with uncertainty.');
    if(/machine learning|classification|clustering/.test(t))tasks.push('Separate training and test data, fit the model, evaluate with appropriate metrics, inspect errors, and discuss overfitting and research limitations.');
    tasks.push('Write a 150–250 word research interpretation: purpose → method → key result → meaning → limitation → conclusion.');
    return tasks;
  }
  function htmlEscape(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  window.dsLearningTopics=topics;window.dsLearningMath=mathFor;window.dsLearningTasks=taskFor;
  const oldContent=window.dsClassContent;
  if(typeof oldContent==='function')window.dsClassContent=function(c){const x=oldContent(c);x.examTopics=topics(c);x.studyTopics=topics(c);x.datasetTasks=taskFor(c);x.mathCalculations=mathFor(c);x.examFocus=`Study all listed topics. The current class topic is the highest-priority area, followed by the prerequisite topics needed to apply it correctly.`;return x;};
  window.DS_LEARNING_SYLLABUS=S;
})();

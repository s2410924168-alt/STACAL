/* Statistical Hub — detailed, textbook-following class content layer */
const DS_BOOKS={
 research:'Research Methodology: Methods and Techniques — C. R. Kothari & Gaurav Garg',
 math:'Introduction to Mathematical Statistics — Hogg, McKean & Craig',
 excel:'Microsoft Excel Data Analysis For Dummies — Stephen L. Nelson',
 r:'R for Data Science — Hadley Wickham, Mine Çetinkaya-Rundel & Garrett Grolemund',
 python:'Python for Data Analysis — Wes McKinney',
 sql:'Learning SQL — Alan Beaulieu',
 spss:'Discovering Statistics Using IBM SPSS Statistics — Andy Field',
 other:'A Gentle Introduction to Stata — Alan C. Acock',
 bi:'Storytelling with Data — Cole Nussbaumer Knaflic',
 advanced:'Applied Statistics and Probability for Engineers — Montgomery & Runger',
 sem:'A Primer on Partial Least Squares Structural Equation Modeling — Hair et al.',
 ml:'An Introduction to Statistical Learning — James, Witten, Hastie & Tibshirani'
};
const DS_DOMAINS=['Education','Public Health','Agriculture','Economics','Business','Psychology','Environmental Science','Biological Science','Medical Research','Survey Research'];
const DS_DATASETS=[
 {name:'Student Learning',file:'student_learning.csv',vars:'id, group, age, study_hours, attendance, pretest, posttest, gender',domain:'Education'},
 {name:'Crop Trial',file:'crop_trial.csv',vars:'id, variety, fertilizer, irrigation, yield, height, disease_score',domain:'Agriculture'},
 {name:'Clinical Follow-up',file:'clinical_followup.csv',vars:'id, treatment, age, bmi, baseline, followup, adherence, event',domain:'Medical Research'},
 {name:'Household Economy',file:'household_economy.csv',vars:'id, region, income, expenditure, education, employment, savings',domain:'Economics'},
 {name:'Survey Attitudes',file:'survey_attitudes.csv',vars:'id, age, exposure, attitude, intention, outcome, group',domain:'Survey Research'}
];
function dsData(c){return DS_DATASETS[(c.id-1)%DS_DATASETS.length]}
function topicPoints(t){
 const l=t.toLowerCase();
 if(l.includes('research fundamentals')) return ['Meaning, purpose and characteristics of research','Research process: problem → design → data → analysis → conclusion','Exploratory, descriptive, explanatory and predictive aims','Validity, reliability, bias and reproducibility'];
 if(l.includes('research problems')) return ['How to identify a researchable problem','Literature gap versus practical gap versus methodological gap','Scope, feasibility and significance','Turning a broad topic into a precise problem statement'];
 if(l.includes('questions and objectives')) return ['Research question types','General and specific objectives','Alignment among question, objective, variables and analysis','Operational wording and measurable outcomes'];
 if(l.includes('hypotheses')) return ['Null and alternative hypotheses','Directional versus non-directional hypotheses','Statistical versus substantive hypotheses','Decision rules and limitations of p-values'];
 if(l.includes('variables and constructs')) return ['Independent, dependent, mediator, moderator and confounder','Observed variables versus latent constructs','Operational definitions','Causal language versus association'];
 if(l.includes('measurement and coding')) return ['Nominal, ordinal, interval and ratio scales','Coding categories and reference groups','Units, labels and missing-value codes','Measurement error and validity'];
 if(l.includes('sampling')) return ['Target population and sampling frame','Probability versus non-probability sampling','Simple random, systematic, stratified and cluster sampling','Selection bias and representativeness'];
 if(l.includes('ethics')||l.includes('reproducibility')) return ['Informed consent and privacy','Data provenance and version control','Pre-registration and transparent analysis','Reproducible code, outputs and reporting'];
 if(l.includes('algebra')) return ['Variables, constants and expressions','Linear and quadratic equations','Inequalities and rearrangement','Unit-aware calculation and verification'];
 if(l.includes('function')) return ['Domain, range and mapping','Linear, polynomial, exponential and logarithmic functions','Transformations and inverse functions','Interpreting functions as statistical relationships'];
 if(l.includes('exponents')||l.includes('logarithms')) return ['Exponent laws','Natural and base-10 logarithms','Log transforms for skewed data','Back-transformation and interpretation'];
 if(l.includes('summation')) return ['Sigma notation','Expanding and simplifying sums','Mean and variance from summation notation','Vectorized computation in R'];
 if(l.includes('differentiation')||l.includes('optimization')) return ['First and second derivatives','Stationary points and curvature','Constrained versus unconstrained optimization','Why optimization appears in likelihood and machine learning'];
 if(l.includes('partial derivatives')||l.includes('gradients')) return ['Partial derivatives','Gradient vectors','Learning rate and gradient descent','Numerical checking of derivatives'];
 if(l.includes('matrices')||l.includes('vectors')||l.includes('linear systems')||l.includes('eigen')) return ['Vectors and matrix dimensions','Matrix multiplication and transpose','Systems Ax=b and rank','Eigenvalues/eigenvectors and their statistical applications'];
 if(l.includes('descriptive statistics')) return ['Center: mean, median and mode','Spread: variance, standard deviation, IQR','Moments, skewness and kurtosis','Choosing summaries according to measurement scale'];
 if(l.includes('probability')||l.includes('combinator')) return ['Sample spaces and events','Conditional probability and independence','Counting rules and combinations','Bayes theorem and research interpretation'];
 if(l.includes('random variables')||l.includes('distribution')) return ['PMF/PDF/CDF','Expectation and variance','Discrete versus continuous variables','Parameter interpretation and simulation'];
 if(l.includes('joint')) return ['Joint, marginal and conditional distributions','Independence','Covariance from joint distributions','Applications to multivariable research data'];
 if(l.includes('covariance')||l.includes('correlation')) return ['Covariance and scale dependence','Pearson correlation','Rank correlation','Association is not causation and outlier sensitivity'];
 if(l.includes('likelihood')||l.includes('mle')) return ['Likelihood as a function of parameters','Log-likelihood','Score and information concepts','MLE estimation, uncertainty and model assumptions'];
 if(l.includes('excel')) return ['Workbook and research data structure','Formula logic and cell references','Cleaning, validation and error checking','Analysis output and reproducible documentation'];
 if(l.includes('pivot')) return ['Rows, columns, values and filters','Aggregating research observations','PivotCharts for exploratory analysis','Avoiding double counting and incorrect denominators'];
 if(l.includes('regression')) return ['Outcome and predictor specification','Coefficient interpretation','Model fit and residual diagnostics','Prediction versus explanation'];
 if(l.includes('anova')) return ['Between-group and within-group variation','F statistic and degrees of freedom','Assumptions and effect size','Post-hoc comparisons when justified'];
 if(l.includes('power query')||l.includes('power pivot')) return ['Import and transformation pipeline','Data model and relationships','Calculated measures versus columns','Refreshability and auditability'];
 if(l.includes('r/')||l==='r/rstudio') return ['RStudio interface and projects','Objects, scripts and working directories','Packages and help system','Reproducible workflow'];
 if(l.includes('vector')||l.includes('matrix')) return ['Object types and indexing','Vectorized operations','Dimensions and recycling','When matrices/lists are appropriate'];
 if(l.includes('data frame')||l.includes('factor')) return ['Tidy rectangular data','Factors and categorical coding','Type conversion','Inspection with str(), summary() and unique()'];
 if(l.includes('function')) return ['Function arguments and return values','Scope and reusable analysis functions','Vectorization and apply-family logic','Testing functions with small examples'];
 if(l.includes('import')||l.includes('export')) return ['CSV/Excel import','Encoding and missing values','Schema inspection','Preserving raw data and creating analysis copies'];
 if(l.includes('dplyr')||l.includes('joins')||l.includes('tidyr')) return ['filter/select/mutate/summarise','Group-wise analysis','Keys and joins','Long versus wide data'];
 if(l.includes('ggplot')) return ['Grammar of graphics','Aesthetic mappings and geoms','Facets and scales','Publication-ready labeling'];
 if(l.includes('hypothesis testing')) return ['Null model and test statistic','p-value and significance level','Confidence intervals and effect size','Assumption checking and reporting'];
 if(l.includes('regression')||l.includes('anova')) return ['Model specification','Estimation','Diagnostics','Interpretation and reporting'];
 if(l.includes('non-parametric')) return ['When distributional assumptions are doubtful','Rank-based tests','Effect and interpretation','Limitations versus parametric alternatives'];
 if(l.includes('multivariate')) return ['Multiple outcomes/predictors','Scale and covariance structure','Dimension reduction','Interpretation in substantive context'];
 if(l.includes('diagnostics')) return ['Residuals and fitted values','Outliers and influence','Heteroscedasticity and nonlinearity','Model revision without p-hacking'];
 if(l.includes('python')) return ['Python syntax and objects','Functions and modules','Jupyter workflow','Readable, reproducible analysis'];
 if(l.includes('numpy')) return ['Arrays and dimensions','Vectorized numerical computation','Linear algebra','Numerical stability and verification'];
 if(l.includes('pandas')) return ['Series/DataFrame','Indexing and selection','Groupby, merge and reshape','Missing values and type management'];
 if(l.includes('feature engineering')) return ['Domain-informed transformations','Encoding categorical variables','Scaling and interaction features','Preventing leakage during feature creation'];
 if(l.includes('machine')||l.includes('scikit')||l.includes('train')||l.includes('cross-validation')||l.includes('regularization')||l.includes('hyperparameter')) return ['Define prediction target and metric','Train/validation/test separation','Pipeline-based preprocessing','Cross-validation, tuning and final held-out evaluation'];
 if(l.includes('sql')) return ['Relational tables and keys','Filtering and aggregation','Joins and subqueries','Research cohort construction and data quality'];
 if(l.includes('window')) return ['Partition and order','ROW_NUMBER/RANK','Running and rolling metrics','Avoiding leakage in time-ordered analyses'];
 if(l.includes('normalization')||l.includes('index')) return ['Normalization goals','Functional dependencies','Primary/foreign keys','Indexes and query-performance trade-offs'];
 if(l.includes('spss')) return ['Variable View and Data View','Labels, value coding and missing values','Menu workflow and syntax','Output interpretation and reproducible reporting'];
 if(l.includes('crosstab')||l.includes('chi-square')) return ['Contingency tables','Expected counts','Chi-square statistic','Effect size and assumptions'];
 if(l.includes('t-test')) return ['Difference in means','Independent versus paired designs','Confidence interval and effect size','Assumption checks'];
 if(l.includes('ancova')) return ['Covariate adjustment','Homogeneity of regression slopes','Adjusted means','Interpretation and design limitations'];
 if(l.includes('logistic')) return ['Binary outcome','Log-odds and odds ratio','Predicted probabilities','Classification diagnostics'];
 if(l.includes('factor')||l.includes('pca')) return ['Correlation structure','Adequacy and extraction','Rotation and interpretation','Component/factor scores and limitations'];
 if(l.includes('visualization')) return ['Match chart to analytical question','Scale, labeling and uncertainty','Avoid misleading encodings','Publication and presentation standards'];
 if(l.includes('dashboard')||l.includes('power bi')||l.includes('tableau')||l.includes('dax')) return ['Data model before visuals','Measures and filter context','KPI and interaction design','Storytelling and decision-focused dashboards'];
 if(l.includes('effect sizes')) return ['Statistical versus practical significance','Standardized and unstandardized effects','Confidence intervals','Contextual interpretation'];
 if(l.includes('multiple comparisons')||l.includes('lsd')||l.includes('tukey')||l.includes('bonferroni')||l.includes('dmrt')) return ['Why multiple testing matters','Family-wise error concepts','When each post-hoc procedure is appropriate','Compact-letter/grouping interpretation where applicable'];
 if(l.includes('pca')||l.includes('factor')||l.includes('cluster')) return ['Similarity/covariance structure','Preprocessing and scaling','Number of dimensions/groups','Substantive interpretation and validation'];
 if(l.includes('sem')||l.includes('construct')||l.includes('reflective')||l.includes('formative')||l.includes('pls')) return ['Latent constructs and indicators','Reflective versus formative logic','Measurement quality','Structural paths, R², f² and predictive assessment'];
 if(l.includes('bootstrapping')||l.includes('mediation')||l.includes('moderation')||l.includes('multi-group')) return ['Indirect and conditional effects','Resampling logic','Confidence intervals','Substantive interpretation and model specification'];
 return ['Define the concept and research purpose','Identify data and assumptions','Apply the appropriate analytical workflow','Verify results and interpret in context','Document and report the evidence'];
}
function dsContent(c){
 const t=c.title, low=t.toLowerCase(), d=dsData(c), points=topicPoints(t);
 let formula='Define the research question → identify variable/data types → select method → check assumptions → compute → quantify uncertainty/effect → interpret → report.';
 if(/correlation/.test(low)) formula='r = cov(X,Y)/(sX sY), with −1 ≤ r ≤ 1. Correlation measures linear association, not causation.';
 else if(/regression/.test(low)) formula='Linear regression: Y = β₀ + β₁X + ε. β₁ is the expected change in Y for a one-unit change in X, conditional on other included predictors.';
 else if(/logistic/.test(low)) formula='logit(p)=ln[p/(1−p)] = β₀+β₁X; exp(β₁) is the odds ratio for a one-unit predictor increase.';
 else if(/anova|lsd|tukey|bonferroni|dmrt/.test(low)) formula='F = MS_between / MS_within. Post-hoc comparisons are used only after an appropriate overall analysis and design justification.';
 else if(/different|gradient|optimization/.test(low)) formula='At an interior optimum, ∇L(θ)=0. Gradient descent: θₜ₊₁ = θₜ − η∇L(θₜ).';
 else if(/probability|distribution|random|likelihood|mle/.test(low)) formula='P(A|B)=P(A∩B)/P(B); E(X)=Σxp(x) or ∫xf(x)dx; MLE chooses θ that maximizes L(θ|data).';
 else if(/matrix|vector|linear system|eigen/.test(low)) formula='Ax=b for linear systems; Av=λv for eigen analysis. Always verify dimensions, rank and numerical results.';
 else if(/confidence|estimation/.test(low)) formula='A common large-sample 95% CI is estimate ± 1.96 × SE(estimate), subject to the assumptions of the estimator.';
 else if(/ridge|lasso|elastic/.test(low)) formula='Ridge minimizes RSS + λΣβⱼ²; Lasso minimizes RSS + λΣ|βⱼ|. λ controls shrinkage and must be tuned without using the test set.';
 else if(/pls|sem|construct|reflective|formative/.test(low)) formula='Separate measurement evaluation from structural evaluation; report appropriate validity/reliability evidence, path estimates, R²/f² and predictive evidence.';
 else if(/machine|classification|tree|forest|boost|knn|svm|bayes|clustering/.test(low)) formula='Prediction workflow: target → split → preprocessing → baseline → cross-validation/tuning → held-out evaluation; leakage must be prevented.';
 const rCode=`# ${t} — reproducible R practice\n# Download the class dataset first.\ndat <- read.csv("${d.file}")\nstr(dat)\nsummary(dat)\n\n# Inspect the research variables\nhead(dat)\n\n# Example analysis logic (adapt to the exact class topic)\nif(all(c("posttest","study_hours") %in% names(dat))) {\n  print(cor.test(dat$study_hours, dat$posttest))\n  fit <- lm(posttest ~ study_hours + attendance, data=dat)\n  print(summary(fit))\n}\n\n# Always save your script and output; never overwrite the raw CSV.`;
 return {
  objectives:[`Explain ${t} using correct statistical/research terminology.`,`Identify the relevant variables, measurement level and data structure.`,`Follow the method step-by-step on a realistic research dataset.`,`Reproduce the main analysis in R and verify the result.`,`Interpret findings with assumptions, uncertainty and practical meaning.`,`Write a concise research-ready conclusion without overstating causality.`],
  points,
  theory:`<p><b>Follow these points in order:</b></p><ol>${points.map(p=>`<li>${p}</li>`).join('')}</ol><p>This lesson should be read alongside the recommended reference book. Learn the concept first, then reproduce the worked example using the supplied dataset.</p>`,
  formula,
  case:`A ${d.domain.toLowerCase()} researcher is studying <b>${t.toLowerCase()}</b>. The supplied <b>${d.name}</b> dataset contains realistic research variables. First define the question and unit of analysis; then choose the method, run the analysis, inspect diagnostics where applicable, and interpret the result in the study context.`,
  dataset:`<b>${d.name}</b><br>Variables: ${d.vars}<br>Domain: ${d.domain}<br><br><a class="btn" download href="data-science-datasets/${d.file}">⬇ Download ${d.file}</a><br><span class="muted">Use the CSV for the R practice. Keep a raw copy unchanged and work from an analysis copy.</span>`,
  r:rCode,
  interpretation:`The output must be interpreted using the class-specific quantity: coefficient, difference, test statistic, probability, classification metric, component, path, etc. Report the estimate and relevant uncertainty/effect size, then explain its substantive meaning. Do not treat a small p-value as proof of causation.`,
  reporting:`<b>Suggested reporting structure:</b> (1) state the research question and sample/data, (2) name the method and key assumptions, (3) report the main estimate/statistic with uncertainty/effect size where appropriate, (4) interpret in the research context, and (5) state important limitations.`,
  practice:`Download <b>${d.file}</b>, reproduce the R example, then modify the analysis to answer one additional research question. Save the R script, output and a 150–250 word interpretation.`,
  book:DS_BOOKS[['research','math','excel','r','python','sql','spss','other','bi','advanced','sem','ml'][c.phase]]
 };
}
window.DS_BOOKS=DS_BOOKS;window.dsContent=dsContent;window.dsData=dsData;
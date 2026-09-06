/* Statistical Hub — Research + Data Science Mastery content library */
const DS_BOOKS={
 research:'Research Methodology: Methods and Techniques — C.R. Kothari & Gaurav Garg',
 math:'Introduction to Mathematical Statistics — Hogg, McKean & Craig',
 excel:'Microsoft Excel for Data Analysis — Conrad Carlberg',
 r:'R for Data Science — Hadley Wickham, Mine Çetinkaya-Rundel & Garrett Grolemund',
 python:'Python for Data Analysis — Wes McKinney',
 sql:'Learning SQL — Alan Beaulieu',
 spss:'Discovering Statistics Using IBM SPSS Statistics — Andy Field',
 other:'The Stata Book / practical documentation for the selected software',
 bi:'Storytelling with Data — Cole Nussbaumer Knaflic',
 advanced:'Applied Statistics and Probability for Engineers — Montgomery & Runger',
 sem:'A Primer on Partial Least Squares Structural Equation Modeling — Hair et al.',
 ml:'An Introduction to Statistical Learning — James, Witten, Hastie & Tibshirani'
};
const DS_DOMAINS=['Education','Public Health','Agriculture','Economics','Business','Psychology','Environmental Science','Biological Science','Medical Research','Survey Research'];
function dsContent(c){
 const t=c.title, low=t.toLowerCase(), phase=c.phase;
 let book=DS_BOOKS[phase];
 let formula='Define the research question first, identify variable/data types, select a defensible method, verify assumptions, quantify uncertainty/effect size, and interpret in context.';
 if(/different|gradient|optimization/.test(low)) formula='For a differentiable objective L(θ), a stationary point satisfies ∇L(θ)=0; gradient descent uses θₜ₊₁=θₜ−η∇L(θₜ).';
 else if(/matrix|vector|linear systems/.test(low)) formula='Matrix representation: Ax=b. For eigen analysis, Av=λv. Dimensions and rank must be checked before interpretation.';
 else if(/probability|distribution|random|combinator|joint|likelihood|mle/.test(low)) formula='P(A|B)=P(A∩B)/P(B); E(X)=Σxp(x) or ∫xf(x)dx; MLE maximizes L(θ|x) or equivalently log L.';
 else if(/correlation/.test(low)) formula='Pearson r = cov(X,Y)/(sX sY); r measures linear association, not causation.';
 else if(/regression|logistic|glm/.test(low)) formula='Linear: y=Xβ+ε. Logistic: log[p/(1−p)]=Xβ. Estimate, diagnose, quantify uncertainty and report effect sizes.';
 else if(/anova|lsd|tukey|bonferroni|dmrt/.test(low)) formula='ANOVA F = MS_between/MS_within. Post-hoc procedures must follow a valid family-wise comparison strategy.';
 else if(/pca|factor|cluster/.test(low)) formula='Multivariate methods operate on covariance/correlation structure or distances; scaling, adequacy and substantive interpretation are essential.';
 else if(/pls|sem|construct|reflective|formative|bootstr/.test(low)) formula='Separate measurement evaluation from structural evaluation; report loadings/validity where appropriate, then paths, R², effect sizes and predictive evidence.';
 else if(/machine|ridge|lasso|tree|forest|boost|knn|svm|bayes|classification|predictive|hyperparameter|leakage/.test(low)) formula='Prediction workflow: target → split → preprocessing → baseline → cross-validation/tuning → held-out evaluation; prevent leakage at every step.';
 return {
  objectives:[`Explain the core ideas behind “${t}” in a research context.`,`Identify the required variables, data structure and assumptions.`,`Apply the method/software workflow to a realistic dataset.`,`Interpret output without overstating causality or statistical significance.`,`Produce a concise, publication-ready research conclusion.`],
  theory:`${t} is taught through a research-first workflow. Start with the substantive question, define the unit of analysis and measurement, inspect the data structure, then choose the method that matches the design and objective. For this class, focus on what the method estimates, what assumptions it needs, how results can fail, and how the evidence should be communicated.`,
  formula,
  case:`Research case (${DS_DOMAINS[c.id%DS_DOMAINS.length]}): a researcher wants to study ${t.toLowerCase()} using a real-world study dataset. The outcome, predictors and design must be defined before computation. Compare the observed result with the research hypothesis and document limitations.`,
  dataset:`Research dataset: one row represents one study unit. Example fields include ID, group/exposure, age, outcome, baseline measure, follow-up measure and relevant covariates. Coding, units, missing-value rules and inclusion/exclusion criteria should be recorded in a data dictionary.`,
  r:`# Reproducible R example for ${t}\n# Replace the example vectors with the class dataset.\ndat <- data.frame(\n  outcome = c(62,68,71,59,75,70,66,78,64,73),\n  exposure = c(4,6,7,3,8,7,5,9,4,8),\n  group = factor(c('A','A','B','B','A','B','A','B','A','B'))\n)\nsummary(dat)\nmodel <- lm(outcome ~ exposure + group, data=dat)\nsummary(model)\nplot(model)\n# Interpret coefficients with units and uncertainty; do not infer causation from an observational example.`,
  interpretation:'Interpret the numerical result in the units of the outcome. State direction and magnitude, uncertainty where relevant, assumptions/diagnostics, and whether the evidence supports the research question. Separate statistical evidence from practical importance.',
  reporting:`Example reporting template: “Using the specified research dataset, we analyzed ${t.toLowerCase()} according to the study objective. The estimated result was interpreted with its uncertainty and relevant diagnostics. The finding should be considered in light of the sampling/design limitations and should not be interpreted as causal unless the design supports causality.”`,
  practice:`Practice: obtain or construct a dataset relevant to ${t.toLowerCase()}, document every variable in a data dictionary, perform the complete workflow, save the code/output, and write a 150–250 word research interpretation.`,
  book
 };
}
window.DS_BOOKS=DS_BOOKS; window.dsContent=dsContent;
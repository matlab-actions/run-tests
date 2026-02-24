// import { readFileSync, unlinkSync, existsSync } from "fs";
// import * as path from "path";
// import * as core from "@actions/core";

// // interfaces for coverage data
// interface CoverageMetric {
//     Executed: number;
//     Total: number;
//     Percentage: number;
// }

// interface CoverageData {
//     StatementCoverage: CoverageMetric;
//     FunctionCoverage: CoverageMetric;
//     DecisionCoverage: CoverageMetric;
//     ConditionCoverage: CoverageMetric;
//     MCDCCoverage: CoverageMetric;
// }

// // function to write coverage summary
// export function writeCoverageSummary() {
//     try {
//         // Check if the flag is enabled
//         const coverageSummaryEnabled = core.getBooleanInput('code-coverage-summary-view');
        
//         if (!coverageSummaryEnabled) {
//             console.log("Code coverage summary view is disabled");
//             return;
//         }

//         const runnerTemp = process.env.RUNNER_TEMP || "";
//         const runId = process.env.GITHUB_RUN_ID || "";
//         const coveragePath = path.join(runnerTemp, `matlabCoverageResults${runId}.json`);
        
//         if (!existsSync(coveragePath)) {
//             console.log("No coverage data found");
//             return;
//         }

//         const coverageData: CoverageData[] = JSON.parse(readFileSync(coveragePath, "utf8"));
        
//         if (!coverageData || coverageData.length === 0) {
//             console.log("Coverage data is empty");
//             return;
//         }

//         // Use the latest coverage data (last element in array)
//         const latestCoverage = coverageData[coverageData.length - 1];
        
//         // Create the summary using the proper GitHub Actions summary API
//         core.summary
//             .addHeading("MATLAB Code Coverage", 2)
//             .addTable([
//                 // Header row
//                 [
//                     {data: 'Coverage Type', header: true},
//                     {data: 'Percentage', header: true},
//                     {data: 'Covered/Total', header: true}
//                 ],
//                 // Data rows
//                 ['Statement', 
//                  `${latestCoverage.StatementCoverage.Percentage.toFixed(2)}%`,
//                  `${latestCoverage.StatementCoverage.Executed}/${latestCoverage.StatementCoverage.Total}`],
//                 ['Function',
//                  `${latestCoverage.FunctionCoverage.Percentage.toFixed(2)}%`,
//                  `${latestCoverage.FunctionCoverage.Executed}/${latestCoverage.FunctionCoverage.Total}`],
//                 ['Decision',
//                  `${latestCoverage.DecisionCoverage.Percentage.toFixed(2)}%`,
//                  `${latestCoverage.DecisionCoverage.Executed}/${latestCoverage.DecisionCoverage.Total}`],
//                 ['Condition',
//                  `${latestCoverage.ConditionCoverage.Percentage.toFixed(2)}%`,
//                  `${latestCoverage.ConditionCoverage.Executed}/${latestCoverage.ConditionCoverage.Total}`],
//                 ['MC/DC',
//                  `${latestCoverage.MCDCCoverage.Percentage?.toFixed(2) || '0.00'}%`,
//                  `${latestCoverage.MCDCCoverage.Executed}/${latestCoverage.MCDCCoverage.Total}`]
//             ])
//             .write();
        
//         // Clean up the file after reading
//         try {
//             unlinkSync(coveragePath);
//         } catch (e) {
//             console.error(`Error deleting coverage file ${coveragePath}:`, e);
//         }
//     } catch (e) {
//         console.error("An error occurred while adding coverage results to the summary:", e);
//     }
// }





// import * as core from "@actions/core";
// import { getOctokit, context } from "@actions/github";
// import { readFileSync, existsSync } from "fs";
// import * as path from "path";

// interface CoverageMetric {
//     Executed: number;
//     Total: number;
//     Percentage: number;
// }

// interface CoverageData {
//     StatementCoverage: CoverageMetric;
//     FunctionCoverage: CoverageMetric;
//     DecisionCoverage: CoverageMetric;
//     ConditionCoverage: CoverageMetric;
//     MCDCCoverage: CoverageMetric;
// }

// export function writeCoverageSummary() {
//     const runnerTemp = process.env.RUNNER_TEMP || "";
//     const runId = process.env.GITHUB_RUN_ID || "";
//     const coveragePath = path.join(runnerTemp, `matlabCoverageResults${runId}.json`);
    
//     core.info(`Looking for coverage at: ${coveragePath}`);
    
//     if (!existsSync(coveragePath)) {
//         core.info("No coverage data found");
//         return;
//     }

//     const coverageData: CoverageData[] = JSON.parse(readFileSync(coveragePath, "utf8"));
//     if (!coverageData || coverageData.length === 0) {
//         core.info("Coverage data is empty");
//         return;
//     }

//     const latestCoverage = coverageData[coverageData.length - 1];
    
//     // Write the summary (existing code)
//     writeSummaryTable(latestCoverage);
    
//     // Also create the GitHub check
//     createGitHubCheck(latestCoverage).catch(error => {
//         core.error(`Error creating GitHub check: ${error}`);
//     });
// }

// function writeSummaryTable(latestCoverage: CoverageData) {
//     // Your existing summary table code
//     core.summary.addHeading("MATLAB Code Coverage", 2);
    
//     const headers = [
//         { data: "Coverage Type", header: true },
//         { data: "Percentage", header: true },
//         { data: "Covered/Total", header: true }
//     ];
    
//     const rows = [
//         ["Statement", 
//          `${latestCoverage.StatementCoverage.Percentage.toFixed(2)}%`,
//          `${latestCoverage.StatementCoverage.Executed}/${latestCoverage.StatementCoverage.Total}`],
//         ["Function",
//          `${latestCoverage.FunctionCoverage.Percentage.toFixed(2)}%`,
//          `${latestCoverage.FunctionCoverage.Executed}/${latestCoverage.FunctionCoverage.Total}`],
//         ["Decision",
//          `${latestCoverage.DecisionCoverage.Percentage.toFixed(2)}%`,
//          `${latestCoverage.DecisionCoverage.Executed}/${latestCoverage.DecisionCoverage.Total}`],
//         ["Condition",
//          `${latestCoverage.ConditionCoverage.Percentage.toFixed(2)}%`,
//          `${latestCoverage.ConditionCoverage.Executed}/${latestCoverage.ConditionCoverage.Total}`],
//         ["MC/DC",
//          `${latestCoverage.MCDCCoverage.Percentage?.toFixed(2) || '0.00'}%`,
//          `${latestCoverage.MCDCCoverage.Executed}/${latestCoverage.MCDCCoverage.Total}`]
//     ];
    
//     core.summary.addTable([headers, ...rows]);
// }

// async function createGitHubCheck(latestCoverage: CoverageData) {
//     try {
//         const token = process.env.GITHUB_TOKEN || core.getInput('github-token');
        
//         if (!token) {
//             core.warning('No GitHub token provided, skipping check creation');
//             return;
//         }

//         core.info("Creating GitHub check with coverage data...");
        
//         const octokit = getOctokit(token);
//         console.log("tOKEN");
//         console.log(token);
//         const overallPercentage = calculateOverallCoverage(latestCoverage);
        
//         const checkName = 'MATLAB Code Coverage';
//         const summary = generateSummaryMarkdown(latestCoverage, overallPercentage);
        
//         const { data: checkRun } = await octokit.rest.checks.create({
//             owner: context.repo.owner,
//             repo: context.repo.repo,
//             name: checkName,
//             head_sha: context.sha,
//             status: 'completed',
//             conclusion: 'neutral',
//             completed_at: new Date().toISOString(),
//             output: {
//                 title: `Code Coverage: ${overallPercentage.toFixed(2)}%`,
//                 summary: summary,
//                 //text: generateDetailedReport(latestCoverage)
//             }
//         });
        
//         core.info(`✅ Check run created: ${checkRun.html_url}`);
        
//     } catch (error) {
//         throw error; // Re-throw to be caught by caller
//     }
// }

// function calculateOverallCoverage(coverage: CoverageData): number {
//     const metrics = [
//         coverage.StatementCoverage,
//         coverage.FunctionCoverage,
//         coverage.DecisionCoverage,
//         coverage.ConditionCoverage,
//         coverage.MCDCCoverage
//     ];
    
//     let totalExecuted = 0;
//     let totalCount = 0;
    
//     metrics.forEach(metric => {
//         if (metric.Total > 0) {
//             totalExecuted += metric.Executed;
//             totalCount += metric.Total;
//         }
//     });
    
//     return totalCount > 0 ? (totalExecuted / totalCount) * 100 : 0;
// }

// function generateSummaryMarkdown(coverage: CoverageData, overall: number): string {
//     return `**Overall Coverage: ${overall.toFixed(2)}%**

// | Coverage Type | Percentage | Covered/Total |
// |--------------|------------|---------------|
// | Statement | ${coverage.StatementCoverage.Percentage.toFixed(2)}% | ${coverage.StatementCoverage.Executed}/${coverage.StatementCoverage.Total} |
// | Function | ${coverage.FunctionCoverage.Percentage.toFixed(2)}% | ${coverage.FunctionCoverage.Executed}/${coverage.FunctionCoverage.Total} |
// | Decision | ${coverage.DecisionCoverage.Percentage.toFixed(2)}% | ${coverage.DecisionCoverage.Executed}/${coverage.DecisionCoverage.Total} |
// | Condition | ${coverage.ConditionCoverage.Percentage.toFixed(2)}% | ${coverage.ConditionCoverage.Executed}/${coverage.ConditionCoverage.Total} |
// | MC/DC | ${coverage.MCDCCoverage.Percentage?.toFixed(2) || '0.00'}% | ${coverage.MCDCCoverage.Executed}/${coverage.MCDCCoverage.Total} |`;
// }

// function generateDetailedReport(coverage: CoverageData): string {
//     // Your existing detailed report generation
//     let report = '## Detailed Coverage Report\n\n';
    
//     const metrics = [
//         { name: 'Statement Coverage', data: coverage.StatementCoverage },
//         { name: 'Function Coverage', data: coverage.FunctionCoverage },
//         { name: 'Decision Coverage', data: coverage.DecisionCoverage },
//         { name: 'Condition Coverage', data: coverage.ConditionCoverage },
//         { name: 'MC/DC Coverage', data: coverage.MCDCCoverage }
//     ];
    
//     metrics.forEach(metric => {
//         const percentage = metric.data.Percentage || 0;
//         report += `### ${metric.name}\n`;
//         report += `- **Coverage:** ${percentage.toFixed(2)}%\n`;
//         report += `- **Executed:** ${metric.data.Executed}\n`;
//         report += `- **Total:** ${metric.data.Total}\n`;
//         report += `- **Missed:** ${metric.data.Total - metric.data.Executed}\n\n`;
//     });
    
//     return report;
// }




//THE BELOW CODE IS FOR GENERATING COLUMN FORMAT VIEW

import * as core from "@actions/core";
import { getOctokit, context } from "@actions/github";
import { readFileSync, existsSync } from "fs";
import * as path from "path";

interface CoverageMetric {
    Executed: number;
    Total: number;
    Percentage: number;
}

interface CoverageData {
    StatementCoverage: CoverageMetric;
    FunctionCoverage: CoverageMetric;
    DecisionCoverage: CoverageMetric;
    ConditionCoverage: CoverageMetric;
    MCDCCoverage: CoverageMetric;
}

export function writeCoverageSummary() {
    const runnerTemp = process.env.RUNNER_TEMP || "";
    const runId = process.env.GITHUB_RUN_ID || "";
    const coveragePath = path.join(runnerTemp, `matlabCoverageResults${runId}.json`);
    
    core.info(`Looking for coverage at: ${coveragePath}`);
    
    if (!existsSync(coveragePath)) {
        core.info("No coverage data found");
        return;
    }

    const coverageData: CoverageData[] = JSON.parse(readFileSync(coveragePath, "utf8"));

    if (!coverageData || coverageData.length === 0) {
        core.info("Coverage data is empty");
        return;
    }

    const latestCoverage = coverageData[coverageData.length - 1];
    
    // Write the summary (modified to column format)
    writeSummaryTable(latestCoverage);
    
    // Also create the GitHub check
    createGitHubCheck(latestCoverage).catch(error => {
        core.error(`Error creating GitHub check: ${error}`);
    });
}

function writeSummaryTable(latestCoverage: CoverageData) {
    core.summary.addHeading("MATLAB Code Coverage", 2);
    
    const headers = [
        { data: "Metric", header: true },
        { data: "Statement", header: true },
        { data: "Function", header: true },
        { data: "Decision", header: true },
        { data: "Condition", header: true },
        { data: "MC/DC", header: true }
    ];
    
    const rows = [
        [
            "Percentage",
            `${latestCoverage.StatementCoverage.Percentage.toFixed(2)}%`,
            `${latestCoverage.FunctionCoverage.Percentage.toFixed(2)}%`,
            `${latestCoverage.DecisionCoverage.Percentage.toFixed(2)}%`,
            `${latestCoverage.ConditionCoverage.Percentage.toFixed(2)}%`,
            `${latestCoverage.MCDCCoverage.Percentage?.toFixed(2) || '0.00'}%`
        ],
        [
            "Covered/Total",
            `${latestCoverage.StatementCoverage.Executed}/${latestCoverage.StatementCoverage.Total}`,
            `${latestCoverage.FunctionCoverage.Executed}/${latestCoverage.FunctionCoverage.Total}`,
            `${latestCoverage.DecisionCoverage.Executed}/${latestCoverage.DecisionCoverage.Total}`,
            `${latestCoverage.ConditionCoverage.Executed}/${latestCoverage.ConditionCoverage.Total}`,
            `${latestCoverage.MCDCCoverage.Executed}/${latestCoverage.MCDCCoverage.Total}`
        ]
    ];
    
    core.summary.addTable([headers, ...rows]);
}

async function createGitHubCheck(latestCoverage: CoverageData) {
    try {
        const token = process.env.GITHUB_TOKEN || core.getInput('github-token');
        
        if (!token) {
            core.warning('No GitHub token provided, skipping check creation');
            return;
        }

        core.info("Creating GitHub check with coverage data...");
        
        const octokit = getOctokit(token);
        console.log("tOKEN");
        console.log(token);
        
        const overallPercentage = calculateOverallCoverage(latestCoverage);
        
        const checkName = 'MATLAB Code Coverage';
        const summary = generateSummaryMarkdown(latestCoverage, overallPercentage);
        
        const { data: checkRun } = await octokit.rest.checks.create({
            owner: context.repo.owner,
            repo: context.repo.repo,
            name: checkName,
            head_sha: context.sha,
            status: 'completed',
            conclusion: 'neutral',
            completed_at: new Date().toISOString(),
            output: {
                title: `Code Coverage: ${overallPercentage.toFixed(2)}%`,
                summary: summary,
                //text: generateDetailedReport(latestCoverage)
            }
        });
        
        core.info(`✅ Check run created: ${checkRun.html_url}`);
        
    } catch (error) {
        throw error; // Re-throw to be caught by caller
    }
}

function calculateOverallCoverage(coverage: CoverageData): number {
    const metrics = [
        coverage.StatementCoverage,
        coverage.FunctionCoverage,
        coverage.DecisionCoverage,
        coverage.ConditionCoverage,
        coverage.MCDCCoverage
    ];
    
    let totalExecuted = 0;
    let totalCount = 0;
    
    metrics.forEach(metric => {
        if (metric.Total > 0) {
            totalExecuted += metric.Executed;
            totalCount += metric.Total;
        }
    });
    
    return totalCount > 0 ? (totalExecuted / totalCount) * 100 : 0;
}

function generateSummaryMarkdown(coverage: CoverageData, overall: number): string {
    return `**Overall Coverage: ${overall.toFixed(2)}%**

| Metric | Statement | Function | Decision | Condition | MC/DC |
|--------|-----------|----------|----------|-----------|-------|
| Percentage | ${coverage.StatementCoverage.Percentage.toFixed(2)}% | ${coverage.FunctionCoverage.Percentage.toFixed(2)}% | ${coverage.DecisionCoverage.Percentage.toFixed(2)}% | ${coverage.ConditionCoverage.Percentage.toFixed(2)}% | ${coverage.MCDCCoverage.Percentage?.toFixed(2) || '0.00'}% |
| Covered/Total | ${coverage.StatementCoverage.Executed}/${coverage.StatementCoverage.Total} | ${coverage.FunctionCoverage.Executed}/${coverage.FunctionCoverage.Total} | ${coverage.DecisionCoverage.Executed}/${coverage.DecisionCoverage.Total} | ${coverage.ConditionCoverage.Executed}/${coverage.ConditionCoverage.Total} | ${coverage.MCDCCoverage.Executed}/${coverage.MCDCCoverage.Total} |`;
}

function generateDetailedReport(coverage: CoverageData): string {
    // Your existing detailed report generation
    let report = '## Detailed Coverage Report\n\n';
    
    const metrics = [
        { name: 'Statement Coverage', data: coverage.StatementCoverage },
        { name: 'Function Coverage', data: coverage.FunctionCoverage },
        { name: 'Decision Coverage', data: coverage.DecisionCoverage },
        { name: 'Condition Coverage', data: coverage.ConditionCoverage },
        { name: 'MC/DC Coverage', data: coverage.MCDCCoverage }
    ];
    
    metrics.forEach(metric => {
        const percentage = metric.data.Percentage || 0;
        report += `### ${metric.name}\n`;
        report += `- **Coverage:** ${percentage.toFixed(2)}%\n`;
        report += `- **Executed:** ${metric.data.Executed}\n`;
        report += `- **Total:** ${metric.data.Total}\n`;
        report += `- **Missed:** ${metric.data.Total - metric.data.Executed}\n\n`;
    });
    
    return report;
}

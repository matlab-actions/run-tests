import * as core from "@actions/core";
import * as github from "@actions/github";
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

export async function createCoverageCheck() {
    try {
        const token = process.env.GITHUB_TOKEN || core.getInput('github-token');
        if (!token) {
            core.warning('No GitHub token provided, skipping check creation');
            return;
        }

        const octokit = github.getOctokit(token);
        const context = github.context;
        
        // Get coverage data
        const runnerTemp = process.env.RUNNER_TEMP || "";
        const runId = process.env.GITHUB_RUN_ID || "";
        const coveragePath = path.join(runnerTemp, `matlabCoverageResults${runId}.json`);
        
        if (!existsSync(coveragePath)) {
            console.log("No coverage data found for checks");
            return;
        }

        const coverageData: CoverageData[] = JSON.parse(readFileSync(coveragePath, "utf8"));
        if (!coverageData || coverageData.length === 0) {
            console.log("Coverage data is empty for checks");
            return;
        }

        const latestCoverage = coverageData[coverageData.length - 1];
        
        // Calculate overall coverage percentage
        const overallPercentage = calculateOverallCoverage(latestCoverage);
        
        // Create check run
        const checkName = 'MATLAB Code Coverage';
        const summary = generateSummaryMarkdown(latestCoverage, overallPercentage);
        
        const { data: checkRun } = await octokit.rest.checks.create({
            owner: context.repo.owner,
            repo: context.repo.repo,
            name: checkName,
            head_sha: context.sha,
            status: 'completed',
            conclusion: 'neutral', // Always neutral, just informational
            completed_at: new Date().toISOString(),
            output: {
                title: `Code Coverage: ${overallPercentage.toFixed(2)}%`,
                summary: summary,
                text: generateDetailedReport(latestCoverage)
            }
        });
        
        core.info(`Check run created: ${checkRun.html_url}`);
        
    } catch (error) {
        core.error(`Error creating coverage check: ${error}`);
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
    return `
**Overall Coverage: ${overall.toFixed(2)}%**

| Coverage Type | Percentage | Covered/Total |
|--------------|------------|---------------|
| Statement | ${coverage.StatementCoverage.Percentage.toFixed(2)}% | ${coverage.StatementCoverage.Executed}/${coverage.StatementCoverage.Total} |
| Function | ${coverage.FunctionCoverage.Percentage.toFixed(2)}% | ${coverage.FunctionCoverage.Executed}/${coverage.FunctionCoverage.Total} |
| Decision | ${coverage.DecisionCoverage.Percentage.toFixed(2)}% | ${coverage.DecisionCoverage.Executed}/${coverage.DecisionCoverage.Total} |
| Condition | ${coverage.ConditionCoverage.Percentage.toFixed(2)}% | ${coverage.ConditionCoverage.Executed}/${coverage.ConditionCoverage.Total} |
| MC/DC | ${coverage.MCDCCoverage.Percentage?.toFixed(2) || '0.00'}% | ${coverage.MCDCCoverage.Executed}/${coverage.MCDCCoverage.Total} |
`;
}

function generateDetailedReport(coverage: CoverageData): string {
    let report = '## Detailed Coverage Report\n\n';
    
    // Add detailed analysis
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

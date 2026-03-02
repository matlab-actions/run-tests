// import * as core from "@actions/core";
// import { readFileSync, existsSync } from "fs";
// import * as path from "path";

// interface CoverageMetric {
//     Executed: number;
//     Total: number;
//     Percentage: number;
// }

// interface CoverageData {
//     MetricLevel?: string;
//     StatementCoverage: CoverageMetric;
//     FunctionCoverage: CoverageMetric;
//     DecisionCoverage: CoverageMetric;
//     ConditionCoverage: CoverageMetric;
//     MCDCCoverage: CoverageMetric;
// }

// export function getCoverageData(): CoverageData | null {
//     const runnerTemp = process.env.RUNNER_TEMP || "";
//     const runId = process.env.GITHUB_RUN_ID || "";
//     const coveragePath = path.join(runnerTemp, `matlabCoverageResults${runId}.json`);
    
//     core.info(`Looking for coverage at: ${coveragePath}`);
    
//     if (!existsSync(coveragePath)) {
//         core.info("No coverage data found");
//         return null;
//     }

//     const coverageData: CoverageData[] = JSON.parse(readFileSync(coveragePath, "utf8"));
//     if (!coverageData || coverageData.length === 0) {
//         core.info("Coverage data is empty");
//         return null;
//     }

//     return coverageData[coverageData.length - 1];
// }

// function formatMetric(metric: CoverageMetric): string {
//     if (isNaN(metric.Percentage) || metric.Total === 0) {
//         return 'N/A';
//     }
//     return metric.Percentage.toFixed(2) + '%';
// }

// function formatCoveredTotal(metric: CoverageMetric): string {
//     if (isNaN(metric.Percentage) || metric.Total === 0) {
//         return 'N/A';
//     }
//     return `${metric.Executed}/${metric.Total}`;
// }

// export function generateCoverageTableHTML(coverage: CoverageData): string {
//     const metricLevel = coverage.MetricLevel || 'mcdc';
//     const showDecision = ['decision', 'condition', 'mcdc'].includes(metricLevel);
//     const showCondition = ['condition', 'mcdc'].includes(metricLevel);
//     const showMCDC = metricLevel === 'mcdc';

//     let headerRow = `<tr align="center"><th>Metric</th><th>Statement</th><th>Function</th>`;
//     let percentageRow = `<tr align="center"><td><b>Percentage</b></td>` +
//         `<td>${formatMetric(coverage.StatementCoverage)}</td>` +
//         `<td>${formatMetric(coverage.FunctionCoverage)}</td>`;
//     let coveredTotalRow = `<tr align="center"><td><b>Covered/Total</b></td>` +
//         `<td>${formatCoveredTotal(coverage.StatementCoverage)}</td>` +
//         `<td>${formatCoveredTotal(coverage.FunctionCoverage)}</td>`;

//     if (showDecision) {
//         headerRow += `<th>Decision</th>`;
//         percentageRow += `<td>${formatMetric(coverage.DecisionCoverage)}</td>`;
//         coveredTotalRow += `<td>${formatCoveredTotal(coverage.DecisionCoverage)}</td>`;
//     }

//     if (showCondition) {
//         headerRow += `<th>Condition</th>`;
//         percentageRow += `<td>${formatMetric(coverage.ConditionCoverage)}</td>`;
//         coveredTotalRow += `<td>${formatCoveredTotal(coverage.ConditionCoverage)}</td>`;
//     }

//     if (showMCDC) {
//         headerRow += `<th>MC/DC</th>`;
//         percentageRow += `<td>${formatMetric(coverage.MCDCCoverage)}</td>`;
//         coveredTotalRow += `<td>${formatCoveredTotal(coverage.MCDCCoverage)}</td>`;
//     }

//     headerRow += `</tr>`;
//     percentageRow += `</tr>`;
//     coveredTotalRow += `</tr>`;

//     return (
//         `<table>
//             ${headerRow}
//             ${percentageRow}
//             ${coveredTotalRow}
//         </table>`
//     );
// }


import * as core from "@actions/core";
import { readFileSync, existsSync } from "fs";
import * as path from "path";

interface CoverageMetric {
    Executed: number;
    Total: number;
    Percentage: number;
}

interface CoverageData {
    MetricLevel?: string;
    StatementCoverage: CoverageMetric;
    FunctionCoverage: CoverageMetric;
    DecisionCoverage: CoverageMetric;
    ConditionCoverage: CoverageMetric;
    MCDCCoverage: CoverageMetric;
}

export function getCoverageData(): CoverageData | null {
    const runnerTemp = process.env.RUNNER_TEMP || "";
    const runId = process.env.GITHUB_RUN_ID || "";
    const coveragePath = path.join(runnerTemp, `matlabCoverageResults${runId}.json`);
    
    core.info(`Looking for coverage at: ${coveragePath}`);
    
    if (!existsSync(coveragePath)) {
        core.info("No coverage data found");
        return null;
    }

    const coverageData: CoverageData[] = JSON.parse(readFileSync(coveragePath, "utf8"));
    if (!coverageData || coverageData.length === 0) {
        core.info("Coverage data is empty");
        return null;
    }

    return coverageData[coverageData.length - 1];
}

function formatPercentage(percentage: number): string {
    return percentage.toFixed(2) + '%';
}

export function generateCoverageTableHTML(coverage: CoverageData): string {
    const metricLevel = (coverage.MetricLevel || 'mcdc').toLowerCase();
    
    core.info(`Generating coverage table for metric level: ${metricLevel}`);
    
    // Define all possible columns
    const allColumns = [
        { name: 'Statement', data: coverage.StatementCoverage, levels: ['statement', 'decision', 'condition', 'mcdc'] },
        { name: 'Function', data: coverage.FunctionCoverage, levels: ['statement', 'decision', 'condition', 'mcdc'] },
        { name: 'Decision', data: coverage.DecisionCoverage, levels: ['decision', 'condition', 'mcdc'] },
        { name: 'Condition', data: coverage.ConditionCoverage, levels: ['condition', 'mcdc'] },
        { name: 'MC/DC', data: coverage.MCDCCoverage, levels: ['mcdc'] }
    ];

    // Filter columns based on metric level
    const visibleColumns = allColumns.filter(col => col.levels.includes(metricLevel));

    // Build header row
    let headerRow = '<tr align="center"><th>Metric</th>';
    visibleColumns.forEach(col => {
        headerRow += `<th>${col.name}</th>`;
    });
    headerRow += '</tr>';

    // Build percentage row
    let percentageRow = '<tr align="center"><td><b>Percentage</b></td>';
    visibleColumns.forEach(col => {
        percentageRow += `<td>${formatPercentage(col.data.Percentage)}</td>`;
    });
    percentageRow += '</tr>';

    // Build covered/total row
    let coveredTotalRow = '<tr align="center"><td><b>Covered/Total</b></td>';
    visibleColumns.forEach(col => {
        coveredTotalRow += `<td>${col.data.Executed}/${col.data.Total}</td>`;
    });
    coveredTotalRow += '</tr>';

    return (
        `<table>
            ${headerRow}
            ${percentageRow}
            ${coveredTotalRow}
        </table>`
    );
}

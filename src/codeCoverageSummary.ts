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

// function formatPercentage(percentage: number): string {
//     return percentage.toFixed(2) + '%';
// }

// export function generateCoverageTableHTML(coverage: CoverageData): string {
//     const metricLevel = (coverage.MetricLevel || 'mcdc').toLowerCase();
    
//     core.info(`Generating coverage table for metric level: ${metricLevel}`);
    
//     // Define all possible columns
//     const allColumns = [
//         { name: 'Statement', data: coverage.StatementCoverage, levels: ['statement', 'decision', 'condition', 'mcdc'] },
//         { name: 'Function', data: coverage.FunctionCoverage, levels: ['statement', 'decision', 'condition', 'mcdc'] },
//         { name: 'Decision', data: coverage.DecisionCoverage, levels: ['decision', 'condition', 'mcdc'] },
//         { name: 'Condition', data: coverage.ConditionCoverage, levels: ['condition', 'mcdc'] },
//         { name: 'MC/DC', data: coverage.MCDCCoverage, levels: ['mcdc'] }
//     ];

//     // Filter columns based on metric level
//     const visibleColumns = allColumns.filter(col => col.levels.includes(metricLevel));

//     // Build header row
//     let headerRow = '<tr align="center"><th>Metric</th>';
//     visibleColumns.forEach(col => {
//         headerRow += `<th>${col.name}</th>`;
//     });
//     headerRow += '</tr>';

//     // Build percentage row
//     let percentageRow = '<tr align="center"><td><b>Percentage</b></td>';
//     visibleColumns.forEach(col => {
//         percentageRow += `<td>${formatPercentage(col.data.Percentage)}</td>`;
//     });
//     percentageRow += '</tr>';

//     // Build covered/total row
//     let coveredTotalRow = '<tr align="center"><td><b>Covered/Total</b></td>';
//     visibleColumns.forEach(col => {
//         coveredTotalRow += `<td>${col.data.Executed}/${col.data.Total}</td>`;
//     });
//     coveredTotalRow += '</tr>';

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
    StatementCoverage?: CoverageMetric;  // Made optional with ?
    FunctionCoverage?: CoverageMetric;   // Made optional with ?
    DecisionCoverage?: CoverageMetric;   // Made optional with ?
    ConditionCoverage?: CoverageMetric;  // Made optional with ?
    MCDCCoverage?: CoverageMetric;       // Made optional with ?
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

    try {
        const coverageData: CoverageData[] = JSON.parse(readFileSync(coveragePath, "utf8"));
        if (!coverageData || coverageData.length === 0) {
            core.info("Coverage data is empty");
            return null;
        }
        return coverageData[coverageData.length - 1];
    } catch (error) {
        core.error(`Error reading coverage data: ${error}`);
        return null;
    }
}

function formatPercentage(percentage: number): string {
    if (percentage === null || percentage === undefined || isNaN(percentage)) {
        return '0.00%';
    }
    return percentage.toFixed(2) + '%';
}

export function generateCoverageTableHTML(coverage: CoverageData): string {
    try {
        core.info(`Generating coverage table for metric level: ${coverage.MetricLevel}`);
        
        // Define all possible columns
        const allColumns = [
            { name: 'Statement', data: coverage.StatementCoverage },
            { name: 'Function', data: coverage.FunctionCoverage },
            { name: 'Decision', data: coverage.DecisionCoverage },
            { name: 'Condition', data: coverage.ConditionCoverage },
            { name: 'MC/DC', data: coverage.MCDCCoverage }
        ];

        // Filter to only include columns where data actually exists
        const visibleColumns = allColumns.filter(col => col.data !== undefined && col.data !== null);

        if (visibleColumns.length === 0) {
            core.warning('No visible columns found');
            return '<p>No coverage data available</p>';
        }

        core.info(`Visible columns: ${visibleColumns.map(c => c.name).join(', ')}`);

        // Build header row
        const headers = visibleColumns.map(col => `<th>${col.name}</th>`).join('');
        const headerRow = `<tr align="center"><th>Metric</th>${headers}</tr>`;

        // Build percentage row
        const percentages = visibleColumns.map(col => 
            `<td>${formatPercentage(col.data!.Percentage)}</td>`
        ).join('');
        const percentageRow = `<tr align="center"><td><b>Percentage</b></td>${percentages}</tr>`;

        // Build covered/total row
        const coveredTotals = visibleColumns.map(col => 
            `<td>${col.data!.Executed}/${col.data!.Total}</td>`
        ).join('');
        const coveredTotalRow = `<tr align="center"><td><b>Covered/Total</b></td>${coveredTotals}</tr>`;

        const tableHTML = `<table>${headerRow}${percentageRow}${coveredTotalRow}</table>`;
        core.info(`Generated table HTML: ${tableHTML}`);
        
        return tableHTML;
    } catch (error) {
        core.error(`Error generating coverage table: ${error}`);
        return '<p>Error generating coverage table</p>';
    }
}

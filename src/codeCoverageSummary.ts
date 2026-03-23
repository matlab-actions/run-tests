
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
    StatementCoverage?: CoverageMetric;  
    FunctionCoverage?: CoverageMetric;   
    DecisionCoverage?: CoverageMetric;   
    ConditionCoverage?: CoverageMetric;  
    MCDCCoverage?: CoverageMetric;       
}

export function getCoverageData(): CoverageData | null {
    const runnerTemp = process.env.RUNNER_TEMP || "";
    const runId = process.env.GITHUB_RUN_ID || "";
    const coveragePath = path.join(runnerTemp, `matlabCoverageResults${runId}.json`);
    
    if (!existsSync(coveragePath)) {
        return null;
    }

    try {
        const coverageData: CoverageData[] = JSON.parse(readFileSync(coveragePath, "utf8"));
        if (!coverageData || coverageData.length === 0) {
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
        
        return tableHTML;
    } catch (error) {
        core.error(`Error generating coverage table: ${error}`);
        return '<p>Error generating coverage table</p>';
    }
}

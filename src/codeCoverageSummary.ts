import { readFileSync, unlinkSync, existsSync } from "fs";
import * as path from "path";
import * as core from "@actions/core";

// interfaces for coverage data
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

// function to write coverage summary
export function writeCoverageSummary() {
    try {
        const runnerTemp = process.env.RUNNER_TEMP || "";
        const runId = process.env.GITHUB_RUN_ID || "";
        const coveragePath = path.join(runnerTemp, `matlabCoverageResults${runId}.json`);
        
        if (!existsSync(coveragePath)) {
            console.log("No coverage data found");
            return;
        }

        const coverageData: CoverageData[] = JSON.parse(readFileSync(coveragePath, "utf8"));
        
        if (!coverageData || coverageData.length === 0) {
            console.log("Coverage data is empty");
            return;
        }

        // Use the latest coverage data (last element in array)
        const latestCoverage = coverageData[coverageData.length - 1];
        
        const coverageTable = createCoverageTable(latestCoverage);
        
        core.summary
            .addHeading("Overall Coverage")
            .addRaw(coverageTable, true)
            .write();
            
        // Clean up the file after reading
        try {
            unlinkSync(coveragePath);
        } catch (e) {
            console.error(`Error deleting coverage file ${coveragePath}:`, e);
        }
    } catch (e) {
        console.error("An error occurred while adding coverage results to the summary:", e);
    }
}

function createCoverageTable(coverage: CoverageData): string {
    return `
        <table>
            <thead>
                <tr>
                    <th>Coverage Type</th>
                    <th>Percentage</th>
                    <th>Covered/Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Statement</td>
                    <td>${coverage.StatementCoverage.Percentage.toFixed(2)}%</td>
                    <td>${coverage.StatementCoverage.Executed}/${coverage.StatementCoverage.Total}</td>
                </tr>
                <tr>
                    <td>Function</td>
                    <td>${coverage.FunctionCoverage.Percentage.toFixed(2)}%</td>
                    <td>${coverage.FunctionCoverage.Executed}/${coverage.FunctionCoverage.Total}</td>
                </tr>
                <tr>
                    <td>Decision</td>
                    <td>${coverage.DecisionCoverage.Percentage.toFixed(2)}%</td>
                    <td>${coverage.DecisionCoverage.Executed}/${coverage.DecisionCoverage.Total}</td>
                </tr>
                <tr>
                    <td>Condition</td>
                    <td>${coverage.ConditionCoverage.Percentage.toFixed(2)}%</td>
                    <td>${coverage.ConditionCoverage.Executed}/${coverage.ConditionCoverage.Total}</td>
                </tr>
                <tr>
                    <td>MCDC</td>
                    <td>${coverage.MCDCCoverage.Percentage?.toFixed(2) || '0.00'}%</td>
                    <td>${coverage.MCDCCoverage.Executed}/${coverage.MCDCCoverage.Total}</td>
                </tr>
            </tbody>
        </table>
    `;
}

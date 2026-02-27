import * as core from "@actions/core";
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

export function generateCoverageTableHTML(coverage: CoverageData): string {
    return (
        `<table>
            <tr align="center">
                <th>Metric</th>
                <th>Statement</th>
                <th>Function</th>
                <th>Decision</th>
                <th>Condition</th>
                <th>MC/DC</th>
            </tr>
            <tr align="center">
                <td><b>Percentage</b></td>
                <td>${coverage.StatementCoverage.Percentage.toFixed(2)}%</td>
                <td>${coverage.FunctionCoverage.Percentage.toFixed(2)}%</td>
                <td>${coverage.DecisionCoverage.Percentage.toFixed(2)}%</td>
                <td>${coverage.ConditionCoverage.Percentage.toFixed(2)}%</td>
                <td>${coverage.MCDCCoverage.Percentage?.toFixed(2) || '0.00'}%</td>
            </tr>
            <tr align="center">
                <td><b>Covered/Total</b></td>
                <td>${coverage.StatementCoverage.Executed}/${coverage.StatementCoverage.Total}</td>
                <td>${coverage.FunctionCoverage.Executed}/${coverage.FunctionCoverage.Total}</td>
                <td>${coverage.DecisionCoverage.Executed}/${coverage.DecisionCoverage.Total}</td>
                <td>${coverage.ConditionCoverage.Executed}/${coverage.ConditionCoverage.Total}</td>
                <td>${coverage.MCDCCoverage.Executed}/${coverage.MCDCCoverage.Total}</td>
            </tr>
        </table>`
    );
}

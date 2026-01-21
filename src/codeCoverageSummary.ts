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
        
        // Create the summary using the proper GitHub Actions summary API
        core.summary
            .addHeading("Overall Coverage", 2)
            .addTable([
                // Header row
                [
                    {data: 'Coverage Type', header: true},
                    {data: 'Percentage', header: true},
                    {data: 'Covered/Total', header: true}
                ],
                // Data rows
                ['Statement', 
                 `${latestCoverage.StatementCoverage.Percentage.toFixed(2)}%`,
                 `${latestCoverage.StatementCoverage.Executed}/${latestCoverage.StatementCoverage.Total}`],
                ['Function',
                 `${latestCoverage.FunctionCoverage.Percentage.toFixed(2)}%`,
                 `${latestCoverage.FunctionCoverage.Executed}/${latestCoverage.FunctionCoverage.Total}`],
                ['Decision',
                 `${latestCoverage.DecisionCoverage.Percentage.toFixed(2)}%`,
                 `${latestCoverage.DecisionCoverage.Executed}/${latestCoverage.DecisionCoverage.Total}`],
                ['Condition',
                 `${latestCoverage.ConditionCoverage.Percentage.toFixed(2)}%`,
                 `${latestCoverage.ConditionCoverage.Executed}/${latestCoverage.ConditionCoverage.Total}`],
                ['MC/DC',
                 `${latestCoverage.MCDCCoverage.Percentage?.toFixed(2) || '0.00'}%`,
                 `${latestCoverage.MCDCCoverage.Executed}/${latestCoverage.MCDCCoverage.Total}`]
            ])
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


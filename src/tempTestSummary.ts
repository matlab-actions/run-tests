// Copyright 2025 The MathWorks, Inc.

import { readFileSync, unlinkSync, existsSync } from "fs";
import * as path from "path";
import * as core from "@actions/core";

export enum MatlabTestStatus {
    PASSED = "PASSED",
    FAILED = "FAILED",
    INCOMPLETE = "INCOMPLETE",
    NOT_RUN = "NOT_RUN",
}

interface MatlabTestDiagnostics {
    Event: string;
    Report: string;
}

interface MatlabTestCase {
    Name: string;
    Duration: number;
    Status: MatlabTestStatus;
    Diagnostics: MatlabTestDiagnostics[];
}

interface MatlabTestCaseJson {
    BaseFolder: string;
    TestResult: MatlabTestResultJson;
}

interface MatlabTestResultJson {
    Name: string;
    Duration: number;
    Failed: boolean;
    Incomplete: boolean;
    Passed: boolean;
    Details: {
        DiagnosticRecord?: MatlabTestDiagnostics | MatlabTestDiagnostics[];
    };
}

export interface MatlabTestFile {
    Name: string;
    Path: string;
    TestCases: MatlabTestCase[];
    Duration: number;
    Status: MatlabTestCase["Status"];
}

export interface TestStatistics {
    Total: number;
    Passed: number;
    Failed: number;
    Incomplete: number;
    NotRun: number;
    Duration: number;
}

export interface TestResultsData {
    TestResults: MatlabTestFile[][];
    Stats: TestStatistics;
}

export function processAndAddTestSummary(
    runnerTemp: string,
    runId: string,
    actionName: string,
    workspace: string,
) {
    const testResultsData = getTestResults(runnerTemp, runId, workspace);
    if(testResultsData) {
        addSummary(testResultsData, actionName);
    }
}

export function getTestResults(
    runnerTemp: string,
    runId: string,
    workspace: string,
): TestResultsData | null {
    let testResultsData = null;
    const resultsPath = path.join(runnerTemp, `matlabTestResults${runId}.json`);

    if (existsSync(resultsPath)) {
        try {
            const testArtifact = JSON.parse(readFileSync(resultsPath, "utf8"));
            const testResults: MatlabTestFile[][] = [];
            const stats: TestStatistics = {
                Total: 0,
                Passed: 0,
                Failed: 0,
                Incomplete: 0,
                NotRun: 0,
                Duration: 0,
            };
            testResultsData = {
                TestResults: testResults,
                Stats: stats,
            };

            for (const jsonTestSessionResults of testArtifact) {
                const testSessionResults: MatlabTestFile[] = [];
                const map = new Map<string, MatlabTestFile>();

                const testCases = Array.isArray(jsonTestSessionResults)
                    ? jsonTestSessionResults
                    : [jsonTestSessionResults];

                for (const jsonTestCase of testCases) {
                    processTestCase(testSessionResults, jsonTestCase, map, stats, workspace);
                }

                testResults.push(testSessionResults);
            }
        } catch (e) {
            console.error(
                "An error occurred while reading the test results summary file ${resultsPath}:",
                e,
            );
        } finally {
            try {
                unlinkSync(resultsPath);
            } catch (e) {
                console.error(
                    `An error occurred while trying to delete the test results summary file ${resultsPath}:`,
                    e,
                );
            }
        }
    }

    return testResultsData;
}

export function addSummary(
    testResultsData: TestResultsData,
    actionName: string,
) {
    try {
        const helpLink =
            `<a href="https://github.com/matlab-actions/run-tests/blob/main/README.md#view-test-results"` +
            ` target="_blank" title="View documentation">ℹ️</a>`;
        const header = getTestHeader(testResultsData.Stats);
        const detailedResults = getDetailedResults(testResultsData.TestResults);

        core.summary
            .addHeading("MATLAB Test Results (" + actionName + ") " + helpLink)
            .addRaw(header, true)
            .addHeading("All tests", 3)
            .addRaw(detailedResults, true);
    } catch (e) {
        console.error("An error occurred while adding the test results to the summary:", e);
    }
}

export function getTestHeader(stats: TestStatistics): string {
    return (
        `<table>
            <tr align="center">
                <th>Total tests</th>
                <th>Passed ` + getStatusEmoji(MatlabTestStatus.PASSED) + `</th>
                <th>Failed ` + getStatusEmoji(MatlabTestStatus.FAILED) + `</th>
                <th>Incomplete ` + getStatusEmoji(MatlabTestStatus.INCOMPLETE) + `</th>
                <th>Not Run ` + getStatusEmoji(MatlabTestStatus.NOT_RUN) + `</th>
                <th>Duration(s) ⌛</th>
            </tr>
            <tr align="center">
                <td>` + stats.Total + `</td>
                <td>` + stats.Passed + `</td>
                <td>` + stats.Failed + `</td>
                <td>` + stats.Incomplete + `</td>
                <td>` + stats.NotRun + `</td>
                <td>` + stats.Duration.toFixed(2) + `</td>
            </tr>
        </table>`
    );
}

export function getDetailedResults(testResults: MatlabTestFile[][]): string {
    return (
        `<table>
            <tr>
                <th>Test File</th>
                <th>Duration(s)</th>
            </tr>` +
            testResults
                .flat()
                .map((file) => generateTestFileRow(file))
                .join("") +
        `</table>`
    );
}

function generateTestFileRow(file: MatlabTestFile): string {
    const statusEmoji = getStatusEmoji(file.Status);
    // Always use a linux-style path for display
    const displayPath = file.Path.replace(/\\/g, "/");

    return (
        `<tr>
            <td>
                <details` + (file.Status !== MatlabTestStatus.PASSED ? ` open` : ``) + `>
                    <summary>
                        <b title="` + displayPath + `">` +
                            statusEmoji + ` ` + file.Name +
                        `</b>
                    </summary>
                    <br>
                    <table>
                        <tr>
                            <th>Test</th>
                            <th>Diagnostics</th>
                            <th>Duration(s)</th>
                        </tr>` +
                        file.TestCases.map((tc) => generateTestCaseRow(tc)).join("") +
                    `</table>
                </details>
            </td>
            <td align="center" valign="top">` +
                `<b>` +
                    file.Duration.toFixed(2) +
                `</b>` +
            `</td>
        </tr>`
    );
}

function generateTestCaseRow(testCase: MatlabTestCase): string {
    const statusEmoji = getStatusEmoji(testCase.Status);
    const diagnosticsColumn =
        testCase.Diagnostics.length > 0
            ? testCase.Diagnostics
                .map(
                    (diagnostic) =>
                        `<details>` +
                            `<summary>` +
                                diagnostic.Event +
                            `</summary>` +
                            `<pre style="font-family: monospace; white-space: pre;">` +
                                diagnostic.Report.replace(/\n/g, "<br>").trim() +
                            `</pre>` +
                        `</details>`,
                )
                .join("")
            : "";

    return (
        `<tr>` +
            `<td>` + statusEmoji + ` ` + testCase.Name + `</td>` +
            `<td>` + diagnosticsColumn + `</td>` +
            `<td align="center">` + testCase.Duration.toFixed(2) + `</td>` +
        `</tr>`
    );
}

export function getStatusEmoji(status: MatlabTestStatus): string {
    switch (status) {
        case MatlabTestStatus.PASSED:
            return "✅";
        case MatlabTestStatus.FAILED:
            return "❌";
        case MatlabTestStatus.INCOMPLETE:
            return "⚠️";
        case MatlabTestStatus.NOT_RUN:
            return "🚫";
    }
}

function processTestCase(
    testSessionResults: MatlabTestFile[],
    jsonTestCase: MatlabTestCaseJson,
    map: Map<string, MatlabTestFile>,
    stats: TestStatistics,
    workspace: string,
): void {
    const baseFolder = jsonTestCase.BaseFolder;
    const testResult = jsonTestCase.TestResult;

    const [testFileName, testCaseName] = testResult.Name.split("/");
    const filePath = path.join(baseFolder, testFileName);

    let testFile = map.get(filePath);
    if (!testFile) {
        testFile = {
            Name: testFileName,
            Path: "",
            TestCases: [],
            Duration: 0,
            Status: MatlabTestStatus.NOT_RUN,
        };
        map.set(filePath, testFile);
        testSessionResults.push(testFile);
    }

    testFile.Path = path.join(path.relative(workspace, baseFolder), testFileName);

    const testCase: MatlabTestCase = {
        Name: testCaseName,
        Duration: Number(testResult.Duration.toFixed(2)),
        Status: determineTestStatus(testResult),
        Diagnostics: processDiagnostics(testResult.Details.DiagnosticRecord),
    };

    testFile.TestCases.push(testCase);
    incrementDuration(testFile, testCase.Duration);
    updateFileStatus(testFile, testCase);
    updateStats(testCase, stats);
}

function determineTestStatus(testResult: MatlabTestResultJson): MatlabTestStatus {
    switch (true) {
        case testResult.Failed:
            return MatlabTestStatus.FAILED;
        case testResult.Incomplete:
            return MatlabTestStatus.INCOMPLETE;
        case testResult.Passed:
            return MatlabTestStatus.PASSED;
        default:
            return MatlabTestStatus.NOT_RUN;
    }
}

function processDiagnostics(diagnostics: MatlabTestDiagnostics | MatlabTestDiagnostics[] | undefined): MatlabTestDiagnostics[] {
    if (!diagnostics) return [];

    return Array.isArray(diagnostics) ? diagnostics : [diagnostics];
}

function incrementDuration(testFile: MatlabTestFile, testCaseDuration: number): void {
    testFile.Duration = (testFile.Duration || 0) + testCaseDuration;
}

function updateFileStatus(testFile: MatlabTestFile, testCase: MatlabTestCase): void {
    if (testFile.Status !== MatlabTestStatus.FAILED) {
        if (testCase.Status === MatlabTestStatus.FAILED) {
            testFile.Status = MatlabTestStatus.FAILED;
        } else if (testFile.Status !== MatlabTestStatus.INCOMPLETE) {
            if (testCase.Status === MatlabTestStatus.INCOMPLETE) {
                testFile.Status = MatlabTestStatus.INCOMPLETE;
            } else if (testCase.Status === MatlabTestStatus.PASSED) {
                testFile.Status = MatlabTestStatus.PASSED;
            }
        }
    }
}

function updateStats(testCase: MatlabTestCase, stats: TestStatistics): void {
    stats.Total++;
    switch (testCase.Status) {
        case "PASSED":
            stats.Passed++;
            break;
        case "FAILED":
            stats.Failed++;
            break;
        case "INCOMPLETE":
            stats.Incomplete++;
            break;
        case "NOT_RUN":
            stats.NotRun++;
            break;
    }
    stats.Duration += testCase.Duration;
}

// Copyright 2025 The MathWorks, Inc.
import { readFileSync, unlinkSync, existsSync } from 'fs';
import * as path from 'path';
import * as core from "@actions/core";

// doesn't have id
// number instead of float

export enum MatlabTestStatus {
    PASSED = 'PASSED',
    FAILED = 'FAILED',
    INCOMPLETE = 'INCOMPLETE',
    NOT_RUN = 'NOT_RUN'
}

interface MatlabTestDiagnostics {
    event: string;
    report: string;
}

interface MatlabTestCase {
    name: string;
    duration: number;
    status: MatlabTestStatus;
    diagnostics: MatlabTestDiagnostics[];
}

interface MatlabTestFile {
    name: string;
    path: string;
    testCases: MatlabTestCase[];
    duration: number;
    status: MatlabTestCase['status'];
}

interface TestStatistics {
    total: number;
    passed: number;
    failed: number;
    incomplete: number;
    notRun: number;
    duration: number;
}

interface TestResultsData {
    testResults: MatlabTestFile[][];
    stats: TestStatistics;
}

export function writeSummary(testResults: MatlabTestFile[][], stats: TestStatistics) {
    try {
        const header = getTestHeader(testResults, stats);
        const detailedResults = getDetailedResults(testResults);
        
        core.summary
            .addHeading('MATLAB Test Results')
            .addRaw(header, true)
            .addRaw(`<b>Assertion failed</b> in TestExamples/testNonLeapYear and it did not run to completion.\n    ---------------------\n    Framework Diagnostic:\n    ---------------------\n    assertEqual failed.\n    --> The numeric values are not equal using \"isequaln\".\n    --> Failure table:\n            Actual    Expected    Error    RelativeError\n            ______    ________    _____    _____________\n                                                        abc              1          2         -1          -0.5     \n    \n    Actual Value:\n         1\n    Expected Value:\n         2\n    ------------------\n    Stack Information:\n    ------------------\n    In C:\\Users\\kapilg\\jenkins visualization\\test-results\\jenkins-matlab-plugin\\work\\workspace\\visualization\\tests\\TestExamples.m (TestExamples.testNonLeapYear) at 43`, true)
            .addRaw(formatDiagnosticReport(`<b>Assertion failed</b> in TestExamples/testNonLeapYear and it did not run to completion.\n    ---------------------\n    Framework Diagnostic:\n    ---------------------\n    assertEqual failed.\n    --> The numeric values are not equal using \"isequaln\".\n    --> Failure table:\n            Actual    Expected    Error    RelativeError\n            ______    ________    _____    _____________\n                                                        abc              1          2         -1          -0.5     \n    \n    Actual Value:\n         1\n    Expected Value:\n         2\n    ------------------\n    Stack Information:\n    ------------------\n    In C:\\Users\\kapilg\\jenkins visualization\\test-results\\jenkins-matlab-plugin\\work\\workspace\\visualization\\tests\\TestExamples.m (TestExamples.testNonLeapYear) at 43`), true)
            .addRaw(`<pre>Assertion failed in TestExamples/testNonLeapYear and it did not run to completion.\n    ---------------------\n    Framework Diagnostic:\n    ---------------------\n    assertEqual failed.\n    --> The numeric values are not equal using \"isequaln\".\n    --> Failure table:\n            Actual    Expected    Error    RelativeError\n            ______    ________    _____    _____________\n                                                        \n              1          2         -1          -0.5     \n    \n    Actual Value:\n         1\n    Expected Value:\n         2\n    ------------------\n    Stack Information:\n    ------------------\n    In C:\\Users\\kapilg\\jenkins visualization\\test-results\\jenkins-matlab-plugin\\work\\workspace\\visualization\\tests\\TestExamples.m (TestExamples.testNonLeapYear) at 43</pre>`, true)
            .addRaw(formatDiagnosticReport(`<pre>Assertion failed in TestExamples/testNonLeapYear and it did not run to completion.\n    ---------------------\n    Framework Diagnostic:\n    ---------------------\n    assertEqual failed.\n    --> The numeric values are not equal using \"isequaln\".\n    --> Failure table:\n            Actual    Expected    Error    RelativeError\n            ______    ________    _____    _____________\n                                                        \n              1          2         -1          -0.5     \n    \n    Actual Value:\n         1\n    Expected Value:\n         2\n    ------------------\n    Stack Information:\n    ------------------\n    In C:\\Users\\kapilg\\jenkins visualization\\test-results\\jenkins-matlab-plugin\\work\\workspace\\visualization\\tests\\TestExamples.m (TestExamples.testNonLeapYear) at 43</pre>`), true)
            // .addRaw(`<pre>` + formatDiagnosticReport(`Assertion failed in TestExamples/testNonLeapYear and it did not run to completion.\n    ---------------------\n    Framework Diagnostic:\n    ---------------------\n    assertEqual failed.\n    --> The numeric values are not equal using \"isequaln\".\n    --> Failure table:\n            Actual    Expected    Error    RelativeError\n            ______    ________    _____    _____________\n                                                        \n              1          2         -1          -0.5     \n    \n    Actual Value:\n         1\n    Expected Value:\n         2\n    ------------------\n    Stack Information:\n    ------------------\n    In C:\\Users\\kapilg\\jenkins visualization\\test-results\\jenkins-matlab-plugin\\work\\workspace\\visualization\\tests\\TestExamples.m (TestExamples.testNonLeapYear) at 43`) + `</pre>`, true)
            // .addRaw(`<table><tr><td><b>Assertion failed</b> in TestExamples/testNonLeapYear and it did not run to completion.\n    ---------------------\n    Framework Diagnostic:\n    ---------------------\n    assertEqual failed.\n    --> The numeric values are not equal using \"isequaln\".\n    --> Failure table:\n            Actual    Expected    Error    RelativeError\n            ______    ________    _____    _____________\n                                                        \n              1          2         -1          -0.5     \n    \n    Actual Value:\n         1\n    Expected Value:\n         2\n    ------------------\n    Stack Information:\n    ------------------\n    In C:\\Users\\kapilg\\jenkins visualization\\test-results\\jenkins-matlab-plugin\\work\\workspace\\visualization\\tests\\TestExamples.m (TestExamples.testNonLeapYear) at 43</td></tr></table>`, true)
            .addHeading('All tests', 3)
            // .addRaw(detailedResults, true)
            .write();
    } catch (e) {
        console.error('An error occurred while adding the test results to the summary:', e);
    }
}

function getTestHeader(testResults: MatlabTestFile[][], stats: TestStatistics): string {
    return `<table>
    <tr align="center">
        <th>Total tests</th>
        <th>Passed ✅</th>
        <th>Failed ❌</th>
        <th>Incomplete ⚠️</th>
        <th>Not Run 🚫</th>
        <th>Duration(s) ⌛</th>
    </tr>
    <tr align="center">
        <td>` + stats.total + `</td>
        <td>` + stats.passed + `</td>
        <td>` + stats.failed + `</td>
        <td>` + stats.incomplete + `</td>
        <td>` + stats.notRun + `</td>
        <td>` + stats.duration.toFixed(2) + `</td>
    </tr>
    </table>`;
}

function getDetailedResults(testResults: MatlabTestFile[][]): string {
    return `<table>
    <tr>
      <th>Test File</th>
      <th>Duration(s)</th>
    </tr>` +
    testResults.flat().map(file => generateTestFileRow(file)).join('') +
    `</table>`;
}

function generateTestFileRow(file: MatlabTestFile): string {
    const statusEmoji = getStatusEmoji(file.status);
    return `
    <tr>
      <td>
        <details>
          <summary><b title="` + file.path + `">` + statusEmoji + ` ` + file.name + `</b></summary>
          <table>
            <tr>
              <th>Test</th>
              <th>Diagnostics</th>
              <th>Duration(s)</th>
            </tr>` +
            file.testCases.map(tc => generateTestCaseRow(tc)).join('') +
          `</table>
        </details>
      </td>
      <td align="center" valign="top"><b>` + file.duration.toFixed(2) + `</b></td>
    </tr>`;
}

function generateTestCaseRow(testCase: MatlabTestCase): string {
    const statusEmoji = getStatusEmoji(testCase.status);
    const diagnosticsColumn = testCase.status === MatlabTestStatus.FAILED 
        ? testCase.diagnostics.map(diagnostic => 
            `<details>` +
                `<summary>` + diagnostic.event + `</summary>` +
                // `<p style="white-space: pre-wrap;">` + formatDiagnosticReport(diagnostic.report) + `</p>` +
                `<pre style="white-space: pre-wrap;">` + formatDiagnosticReport(diagnostic.report) + `</pre>` +
            `</details>`
        ).join('')
        : '';

    return `<tr>` +
        `<td>` + statusEmoji + ` ` + testCase.name + `</td>` +
        `<td>` + diagnosticsColumn + `</td>` +
        `<td align="center"><b>` + testCase.duration.toFixed(2) + `</b></td>` +
        `</tr>`;
}

function formatDiagnosticReport(report: string): string {
    return report
        // HTML special characters
        // .replace(/&/g, '&amp;')
        // .replace(/</g, '&lt;')
        // .replace(/>/g, '&gt;')
        // .replace(/"/g, '&quot;')
        // .replace(/'/g, '&#039;')
        // .replace(/`/g, '&#096;')
        // // Path separators for all OS
        // .replace(/\\/g, '\\\\')    // Windows backslash
        // .replace(/\//g, '/')       // Unix forward slash
        // // Preserve MATLAB formatting
        // .replace(/\r\n/g, '\n')    // Windows line endings
        // .replace(/\r/g, '\n')      // Mac old-style line endings
        // .replace(/\t/g, '    ')    // Tabs to spaces
        .replace(/\n\n/g, '<br><br>')
        .trim();
}

function getStatusEmoji(status: MatlabTestStatus): string {
    switch (status) {
        case MatlabTestStatus.PASSED: return '✅';
        case MatlabTestStatus.FAILED: return '❌';
        case MatlabTestStatus.INCOMPLETE: return '⚠️';
        case MatlabTestStatus.NOT_RUN: return '🚫';
    }
}

export function getTestResults(workspace: string): TestResultsData {
    const testResults: MatlabTestFile[][] = [];
    const stats: TestStatistics = { total: 0, passed: 0, failed: 0, incomplete: 0, notRun: 0, duration: 0 };
    const runId = process.env.GITHUB_RUN_ID || '';
    const runnerTemp = process.env.RUNNER_TEMP || '';
    const resultsPath = path.join(runnerTemp, `matlabTestResults${runId}.json`);

    if (existsSync(resultsPath)) {
        try {
            const testArtifact = JSON.parse(readFileSync(resultsPath, 'utf8'));
            
            for (const jsonTestSessionResults of testArtifact) {
                const testSessionResults: MatlabTestFile[] = [];
                const map = new Map<string, MatlabTestFile>();

                const testCases = Array.isArray(jsonTestSessionResults) ? 
                    jsonTestSessionResults : [jsonTestSessionResults];

                for (const jsonTestCase of testCases) {
                    processTestCase(testSessionResults, jsonTestCase, map, workspace, stats);
                }

                testResults.push(testSessionResults);
            }
        } catch (e) {
            console.error('An error occurred while reading the test results summary file ${resultsPath}:', e);
            // return;
        } finally {
            try {
                unlinkSync(resultsPath);
            } catch (e) {
                console.error(`An error occurred while trying to delete the test results summary file ${resultsPath}:`, e);
            }
        }
    }

    return { testResults, stats };
}

function processTestCase(
    testSessionResults: MatlabTestFile[], 
    jsonTestCase: any, 
    map: Map<string, MatlabTestFile>,
    workspace: string,
    stats: TestStatistics
): void {
    const baseFolder = jsonTestCase.BaseFolder;
    const testResult = jsonTestCase.TestResult;
    
    const [testFileName, testCaseName] = testResult.Name.split('/');
    const filePath = path.join(baseFolder, testFileName);

    let testFile = map.get(filePath);
    if (!testFile) {
        testFile = {
            name: testFileName,
            // path: getRelativePath(workspace, baseFolder, testFileName),
            path: "",
            testCases: [],
            duration: 0,
            status: MatlabTestStatus.NOT_RUN
        };
        map.set(filePath, testFile);
        testSessionResults.push(testFile);
    }

    const testCase: MatlabTestCase = {
        name: testCaseName,
        duration: Number(testResult.Duration.toFixed(2)),
        status: determineTestStatus(testResult),
        diagnostics: processDiagnostics(testResult.Details.DiagnosticRecord)
    };

    testFile.testCases.push(testCase);
    incrementDuration(testFile, testCase.duration);
    updateFileStatus(testFile, testCase);
    updateStats(testCase, stats);
}

function incrementDuration(testFile: MatlabTestFile, testCaseDuration: number): void {
    testFile.duration = (testFile.duration || 0) + testCaseDuration;
}

function updateFileStatus(testFile: MatlabTestFile, testCase: MatlabTestCase): void {
    if (testFile.status !== MatlabTestStatus.FAILED) {
        if (testCase.status === MatlabTestStatus.FAILED) {
            testFile.status = MatlabTestStatus.FAILED;
        } else if (testFile.status !== MatlabTestStatus.INCOMPLETE) {
            if (testCase.status === MatlabTestStatus.INCOMPLETE) {
                testFile.status = MatlabTestStatus.INCOMPLETE;
            } else if (testCase.status === MatlabTestStatus.PASSED) {
                testFile.status = MatlabTestStatus.PASSED;
            }
        }
    }
}

function determineTestStatus(testResult: any): MatlabTestStatus {
    if (testResult.Failed) return MatlabTestStatus.FAILED;
    if (testResult.Incomplete) return MatlabTestStatus.INCOMPLETE;
    if (testResult.Passed) return MatlabTestStatus.PASSED;
    return MatlabTestStatus.NOT_RUN;
}

function processDiagnostics(diagnostics: any): MatlabTestDiagnostics[] {
    const results: MatlabTestDiagnostics[] = [];
    
    if (!diagnostics) return results;

    const diagnosticItems = Array.isArray(diagnostics) ? diagnostics : [diagnostics];
    
    for (const item of diagnosticItems) {
        if (item.Event && item.Report) {
            results.push({
                event: item.Event,
                report: item.Report
            });
        }
    }

    return results;
}

function getRelativePath(workspace: string, baseFolder: string, fileName: string): string {
    const relativePath = path.relative(workspace, baseFolder);
    return path.join(workspace, relativePath, fileName);
}

function updateStats(testCase: MatlabTestCase, stats: TestStatistics): void {
    stats.total++;
    switch (testCase.status) {
        case 'PASSED': stats.passed++; break;
        case 'FAILED': stats.failed++; break;
        case 'INCOMPLETE': stats.incomplete++; break;
        case 'NOT_RUN': stats.notRun++; break;
    }
    stats.duration += testCase.duration;
}
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
        const failedTests = getFailedTests(testResults);
        const detailedResults = getDetailedResults(testResults);
        
        core.summary
            .addHeading('MATLAB Test Results')
            .addRaw(header, true)
            .addRaw(failedTests, true)
            .addRaw(detailedResults, true)
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
        <td>${stats.total}</td>
        <td>${stats.passed}</td>
        <td>${stats.failed}</td>
        <td>${stats.incomplete}</td>
        <td>${stats.notRun}</td>
        <td>${stats.duration.toFixed(2)}</td>
    </tr>
    </table>`;
}

function getDetailedResults(testResults: MatlabTestFile[][]): string {
    return `<details><summary><h3>All tests</h3></summary>
    <table>
    <tr>
      <th>Test</th>
      <th>Duration(s)</th>
    </tr>` +
    testResults.flat().map(file => generateTestFileRow(file)).join('\n') +
    `</table>
    </details>`;
}

function generateTestFileRow(file: MatlabTestFile): string {
    const statusEmoji = getStatusEmoji(file.status);
    return `
    <tr>
      <td>
        <details>
          <summary><b>${statusEmoji} ${file.name}</b></summary>
            <ul style="list-style-type: none;">` +
              file.testCases.map(tc => `<li>` + getStatusEmoji(tc.status) + ` ` + tc.name + `</li>`).join('\n') +
            `</ul>
        </details>
      <td align="center" valign="top"><b>${file.duration.toFixed(2)}</b>
      </td>
    </tr>`;
}

function getFailedTests(testResults: MatlabTestFile[][]): string {
    const failedTests = testResults.flat()
        .flatMap(file => file.testCases)
        .filter(test => test.status === MatlabTestStatus.FAILED);

    if (failedTests.length === 0) return '';

    return `<details open><summary><h3>Failed tests</h3></summary>
        <table>
        <tr>
          <th>Test</th>
          <th>Details</th>
        </tr>` + 
        failedTests.map(test => generateFailedTestRow(test)).join('\n') +
        `</table>
    </details>`;
}

function generateFailedTestRow(test: MatlabTestCase): string {
    return `
    <tr>
      <td><b>❌ ${test.name}</b></td>
      <td>
        <details>
          <summary>View details</summary>
          <pre>` +
          test.diagnostics.map(d => d.report).join('\n') +
          `</pre>
        </details>
      </td>
    </tr>`;
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
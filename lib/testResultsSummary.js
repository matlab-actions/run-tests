"use strict";
// Copyright 2025 The MathWorks, Inc.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatlabTestStatus = void 0;
exports.writeSummary = writeSummary;
exports.getTestHeader = getTestHeader;
exports.getDetailedResults = getDetailedResults;
exports.getStatusEmoji = getStatusEmoji;
exports.getTestResults = getTestResults;
const fs_1 = require("fs");
const path = __importStar(require("path"));
const core = __importStar(require("@actions/core"));
var MatlabTestStatus;
(function (MatlabTestStatus) {
    MatlabTestStatus["PASSED"] = "PASSED";
    MatlabTestStatus["FAILED"] = "FAILED";
    MatlabTestStatus["INCOMPLETE"] = "INCOMPLETE";
    MatlabTestStatus["NOT_RUN"] = "NOT_RUN";
})(MatlabTestStatus || (exports.MatlabTestStatus = MatlabTestStatus = {}));
function writeSummary(testResults, stats) {
    try {
        const helpLink = `<a href="https://github.com/matlab-actions/run-tests/blob/main/README.md"` +
            ` target="_blank" title="View documentation">ℹ️</a>`;
        const header = getTestHeader(testResults, stats);
        const detailedResults = getDetailedResults(testResults);
        core.summary
            .addHeading('MATLAB Test Results (' + process.env.GITHUB_ACTION + ') ' + helpLink)
            .addRaw(header, true)
            .addHeading('All tests', 3)
            .addRaw(detailedResults, true)
            .write();
    }
    catch (e) {
        console.error('An error occurred while adding the test results to the summary:', e);
    }
}
function getTestHeader(testResults, stats) {
    return `<table>
                <tr align="center">
                    <th>Total tests</th>
                    <th>Passed ` + getStatusEmoji(MatlabTestStatus.PASSED) + `</th>
                    <th>Failed ` + getStatusEmoji(MatlabTestStatus.FAILED) + `</th>
                    <th>Incomplete ` + getStatusEmoji(MatlabTestStatus.INCOMPLETE) + `</th>
                    <th>Not Run ` + getStatusEmoji(MatlabTestStatus.NOT_RUN) + `</th>
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
function getDetailedResults(testResults) {
    return `<table>
                <tr>
                    <th>Test File</th>
                    <th>Duration(s)</th>
                </tr>` +
        testResults.flat().map(file => generateTestFileRow(file)).join('') +
        `</table>`;
}
function generateTestFileRow(file) {
    const statusEmoji = getStatusEmoji(file.status);
    // Always use a linux-style path for display
    const displayPath = file.path.replace(/\\/g, '/');
    return `<tr>
                <td>
                    <details` + (file.status !== MatlabTestStatus.PASSED ? ` open` : ``) + `>
                        <summary>
                            <b title="` + displayPath + `">` + statusEmoji + ` ` + file.name + `</b>
                        </summary>
                        <br>
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
                <td align="center" valign="top">` +
        `<b>` + file.duration.toFixed(2) + `</b>` +
        `</td>
            </tr>`;
}
function generateTestCaseRow(testCase) {
    const statusEmoji = getStatusEmoji(testCase.status);
    const diagnosticsColumn = testCase.diagnostics.length > 0
        ? testCase.diagnostics.map(diagnostic => `<details>` +
            `<summary>` + diagnostic.event + `</summary>` +
            `<pre style="font-family: monospace; white-space: pre;">` +
            diagnostic.report.replace(/\n/g, '<br>').trim() +
            `</pre>` +
            `</details>`).join('')
        : '';
    return `<tr>` +
        `<td>` + statusEmoji + ` ` + testCase.name + `</td>` +
        `<td>` + diagnosticsColumn + `</td>` +
        `<td align="center">` + testCase.duration.toFixed(2) + `</td>` +
        `</tr>`;
}
function getStatusEmoji(status) {
    switch (status) {
        case MatlabTestStatus.PASSED: return '✅';
        case MatlabTestStatus.FAILED: return '❌';
        case MatlabTestStatus.INCOMPLETE: return '⚠️';
        case MatlabTestStatus.NOT_RUN: return '🚫';
    }
}
function getTestResults() {
    const testResults = [];
    const stats = { total: 0, passed: 0, failed: 0, incomplete: 0, notRun: 0, duration: 0 };
    const runId = process.env.GITHUB_RUN_ID || '';
    const runnerTemp = process.env.RUNNER_TEMP || '';
    const resultsPath = path.join(runnerTemp, `matlabTestResults${runId}.json`);
    if ((0, fs_1.existsSync)(resultsPath)) {
        try {
            const testArtifact = JSON.parse((0, fs_1.readFileSync)(resultsPath, 'utf8'));
            for (const jsonTestSessionResults of testArtifact) {
                const testSessionResults = [];
                const map = new Map();
                const testCases = Array.isArray(jsonTestSessionResults) ?
                    jsonTestSessionResults : [jsonTestSessionResults];
                for (const jsonTestCase of testCases) {
                    processTestCase(testSessionResults, jsonTestCase, map, stats);
                }
                testResults.push(testSessionResults);
            }
        }
        catch (e) {
            console.error('An error occurred while reading the test results summary file ${resultsPath}:', e);
        }
        finally {
            try {
                (0, fs_1.unlinkSync)(resultsPath);
            }
            catch (e) {
                console.error(`An error occurred while trying to delete the test results summary file ${resultsPath}:`, e);
            }
        }
    }
    return { testResults, stats };
}
function processTestCase(testSessionResults, jsonTestCase, map, stats) {
    const baseFolder = jsonTestCase.BaseFolder;
    const testResult = jsonTestCase.TestResult;
    const [testFileName, testCaseName] = testResult.Name.split('/');
    const filePath = path.join(baseFolder, testFileName);
    let testFile = map.get(filePath);
    if (!testFile) {
        testFile = {
            name: testFileName,
            path: '',
            testCases: [],
            duration: 0,
            status: MatlabTestStatus.NOT_RUN
        };
        map.set(filePath, testFile);
        testSessionResults.push(testFile);
    }
    testFile.path = path.join(path.relative(process.env.GITHUB_WORKSPACE || '', baseFolder), testFileName);
    const testCase = {
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
function incrementDuration(testFile, testCaseDuration) {
    testFile.duration = (testFile.duration || 0) + testCaseDuration;
}
function updateFileStatus(testFile, testCase) {
    if (testFile.status !== MatlabTestStatus.FAILED) {
        if (testCase.status === MatlabTestStatus.FAILED) {
            testFile.status = MatlabTestStatus.FAILED;
        }
        else if (testFile.status !== MatlabTestStatus.INCOMPLETE) {
            if (testCase.status === MatlabTestStatus.INCOMPLETE) {
                testFile.status = MatlabTestStatus.INCOMPLETE;
            }
            else if (testCase.status === MatlabTestStatus.PASSED) {
                testFile.status = MatlabTestStatus.PASSED;
            }
        }
    }
}
function determineTestStatus(testResult) {
    if (testResult.Failed)
        return MatlabTestStatus.FAILED;
    if (testResult.Incomplete)
        return MatlabTestStatus.INCOMPLETE;
    if (testResult.Passed)
        return MatlabTestStatus.PASSED;
    return MatlabTestStatus.NOT_RUN;
}
function processDiagnostics(diagnostics) {
    const results = [];
    if (!diagnostics)
        return results;
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
function updateStats(testCase, stats) {
    stats.total++;
    switch (testCase.status) {
        case 'PASSED':
            stats.passed++;
            break;
        case 'FAILED':
            stats.failed++;
            break;
        case 'INCOMPLETE':
            stats.incomplete++;
            break;
        case 'NOT_RUN':
            stats.notRun++;
            break;
    }
    stats.duration += testCase.duration;
}
//# sourceMappingURL=testResultsSummary.js.map
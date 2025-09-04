// Copyright 2025 The MathWorks, Inc.

import * as testResultsSummary from './testResultsSummary';
import * as path from 'path';
import * as fs from 'fs';
import * as core from '@actions/core';

jest.mock('@actions/core', () => ({
    summary: {
        addHeading: jest.fn().mockReturnThis(),
        addRaw: jest.fn().mockReturnThis(),
        write: jest.fn().mockReturnThis(),
    },
}));

describe('summaryGeneration', () => {
    let testResults: testResultsSummary.MatlabTestFile[][];
    let stats: testResultsSummary.TestStatistics;

    let originalRunnerTemp: string | undefined;
    let originalGithubRunId: string | undefined;
    let originalGithubWorkspace: string | undefined;

    beforeAll(() => {
        // Store original values before modifying them
        originalRunnerTemp = process.env.RUNNER_TEMP;
        originalGithubRunId = process.env.GITHUB_RUN_ID;
        originalGithubWorkspace = process.env.GITHUB_WORKSPACE;

        // Set environment variables for tests
        process.env.RUNNER_TEMP = path.join(__dirname, '..');
        process.env.GITHUB_RUN_ID = '';

        // Get OS information and set paths
        const os = require('os').platform().toLowerCase();
        let osName = "";
        let workspaceParent = "";
        
        if (os.includes("win")) {
            osName = "windows";
            workspaceParent = "C:\\";
        } else if (os.includes("linux") || os.includes("unix") || os.includes("aix")) {
            osName = "linux";
            workspaceParent = "/home/user/";
        } else if (os.includes("darwin")) {
            osName = "mac";
            workspaceParent = "/Users/username/";
        } else {
            throw new Error(`Unsupported OS: ${os}`);
        }
        
        process.env.GITHUB_WORKSPACE = path.join(workspaceParent, "workspace");

        // Copy test data file to the expected location
        const artifactFileName = 'matlabTestResults.json';
        const sourceFilePath = path.join(__dirname, 'test-data', 'testResultsArtifacts', 't1', osName, artifactFileName);
        const destinationFilePath = path.join(process.env.RUNNER_TEMP, artifactFileName);
        console.log('Copying test data from:', sourceFilePath);
        console.log('Copying test data to:', destinationFilePath);

        try {
            fs.copyFileSync(sourceFilePath, destinationFilePath);
        } catch (err) {
            console.error('Error copying test-data:', err);
        }

        // Process test results data
        const testResultsData = testResultsSummary.getTestResults();
        testResults = testResultsData.testResults;
        stats = testResultsData.stats;
    });

    afterAll(() => {
        // Restore original environment variable values
        process.env.RUNNER_TEMP = originalRunnerTemp;
        process.env.GITHUB_RUN_ID = originalGithubRunId;
        process.env.GITHUB_WORKSPACE = originalGithubWorkspace;
    });

    it('should return correct test results data for valid JSON', () => {        
        expect(testResults).toBeDefined();
        expect(stats).toBeDefined();
        expect(testResults.length).toBe(2);
        expect(testResults[0].length).toBe(1);
        expect(testResults[1].length).toBe(1);
        expect(testResults[0][0].testCases.length).toBe(9);
        expect(testResults[1][0].testCases.length).toBe(1);
    });

    it('should return correct test stats for valid JSON', () => {
        expect(stats.total).toBe(10);
        expect(stats.passed).toBe(4);
        expect(stats.failed).toBe(3);
        expect(stats.incomplete).toBe(2);
        expect(stats.notRun).toBe(1);
        expect(stats.duration).toBeCloseTo(1.83);
    });

    it('should return correct test files data for valid JSON', () => {
        expect(testResults[0][0].path).toBe(path.join('visualization', 'tests', 'TestExamples1'));
        expect(testResults[1][0].path).toBe(path.join('visualization', 'duplicate_tests', 'TestExamples2'));
        expect(testResults[0][0].name).toBe('TestExamples1');
        expect(testResults[1][0].name).toBe('TestExamples2');
        expect(testResults[0][0].duration).toBeCloseTo(1.73);
        expect(testResults[1][0].duration).toBeCloseTo(0.10);
        expect(testResults[0][0].status).toBe(testResultsSummary.MatlabTestStatus.FAILED);
        expect(testResults[1][0].status).toBe(testResultsSummary.MatlabTestStatus.INCOMPLETE);
    });

    it('should return correct test cases data for valid JSON', () => {
        expect(testResults[0][0].testCases[0].name).toBe('testNonLeapYear');
        expect(testResults[0][0].testCases[4].name).toBe('testLeapYear');
        expect(testResults[0][0].testCases[7].name).toBe('testValidDateFormat');
        expect(testResults[0][0].testCases[8].name).toBe('testInvalidDateFormat');
        expect(testResults[1][0].testCases[0].name).toBe('testNonLeapYear');
        
        expect(testResults[0][0].testCases[0].status).toBe(testResultsSummary.MatlabTestStatus.PASSED);
        expect(testResults[0][0].testCases[4].status).toBe(testResultsSummary.MatlabTestStatus.FAILED);
        expect(testResults[0][0].testCases[8].status).toBe(testResultsSummary.MatlabTestStatus.NOT_RUN);
        expect(testResults[1][0].testCases[0].status).toBe(testResultsSummary.MatlabTestStatus.INCOMPLETE);

        expect(testResults[0][0].testCases[0].duration).toBeCloseTo(0.1);
        expect(testResults[0][0].testCases[1].duration).toBeCloseTo(0.11);
        expect(testResults[0][0].testCases[2].duration).toBeCloseTo(0.11);
        expect(testResults[0][0].testCases[4].duration).toBeCloseTo(0.40);
        expect(testResults[0][0].testCases[8].duration).toBeCloseTo(0.00);
        expect(testResults[1][0].testCases[0].duration).toBeCloseTo(0.10);

        expect(testResults[0][0].testCases[4].diagnostics[0].event).toBe('SampleDiagnosticsEvent1');
        expect(testResults[0][0].testCases[4].diagnostics[0].report).toBe('SampleDiagnosticsReport1');
        expect(testResults[1][0].testCases[0].diagnostics[0].event).toBe('SampleDiagnosticsEvent2');
        expect(testResults[1][0].testCases[0].diagnostics[0].report).toBe('SampleDiagnosticsReport2');
    });

    it('should write test results data to the GitHub job summary', () => {
        const { testResults, stats } = testResultsSummary.getTestResults();
        testResultsSummary.writeSummary(testResults, stats);

        expect(core.summary.addHeading).toHaveBeenCalledTimes(2);
        expect(core.summary.addHeading).toHaveBeenNthCalledWith(1, 'MATLAB Test Results (' + process.env.GITHUB_ACTION + ')');
        expect(core.summary.addHeading).toHaveBeenNthCalledWith(2, 'All tests', 3);
        expect(core.summary.addRaw).toHaveBeenCalledTimes(2);
        expect(core.summary.write).toHaveBeenCalledTimes(1);
    });
});

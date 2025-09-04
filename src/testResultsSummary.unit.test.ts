// Copyright 2025 The MathWorks, Inc.

import * as testResultsSummary from './testResultsSummary';
import * as path from 'path';
import * as fs from 'fs';
import * as core from '@actions/core';
import { JSDOM } from 'jsdom';

jest.mock('@actions/core', () => ({
    summary: {
        addHeading: jest.fn().mockReturnThis(),
        addRaw: jest.fn().mockReturnThis(),
        write: jest.fn().mockReturnThis(),
    },
}));

jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    unlinkSync: jest.fn(),
}));

describe('Artifact Processing Tests', () => {
    // Shared test data
    let testResults: testResultsSummary.MatlabTestFile[][];
    let stats: testResultsSummary.TestStatistics;
    let originalEnvVars: Record<string, string | undefined>;

    beforeAll(() => {
        // Store and set environment variables once
        originalEnvVars = {
            RUNNER_TEMP: process.env.RUNNER_TEMP,
            GITHUB_RUN_ID: process.env.GITHUB_RUN_ID,
            GITHUB_WORKSPACE: process.env.GITHUB_WORKSPACE
        };

        setupTestEnvironment();
        const testResultsData = testResultsSummary.getTestResults();
        testResults = testResultsData.testResults;
        stats = testResultsData.stats;
    });

    afterAll(() => {
        // Restore environment variables once
        Object.entries(originalEnvVars).forEach(([key, value]) => {
            if (value !== undefined) {
                process.env[key] = value;
            } else {
                delete process.env[key];
            }
        });
    });

    function setupTestEnvironment() {
        process.env.RUNNER_TEMP = path.join(__dirname, '..');
        process.env.GITHUB_RUN_ID = '';
        
        const osInfo = getOSInfo();
        process.env.GITHUB_WORKSPACE = path.join(osInfo.workspaceParent, "workspace");
        
        copyTestDataFile(osInfo.osName);
    }

    function getOSInfo() {
        const os = require('os').platform().toLowerCase();
        if (os.includes("win") && !os.includes("darwin")) return { osName: "windows", workspaceParent: "C:\\" };
        if (os.includes("linux") || os.includes("unix") || os.includes("aix")) return { osName: "linux", workspaceParent: "/home/user/" };
        if (os.includes("darwin")) return { osName: "mac", workspaceParent: "/Users/username/" };
        throw new Error(`Unsupported OS: ${os}`);
    }

    function copyTestDataFile(osName: string) {
        const sourceFilePath = path.join(__dirname, 'test-data', 'testResultsArtifacts', 't1', osName, 'matlabTestResults.json');
        const destinationFilePath = path.join(process.env.RUNNER_TEMP!, 'matlabTestResults.json');
        console.log(`Copying test data from ${sourceFilePath} to ${destinationFilePath}`);
        
        try {
            fs.copyFileSync(sourceFilePath, destinationFilePath);
        } catch (err) {
            console.error('Error copying test-data:', err);
        }
    }

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
        testResultsSummary.writeSummary(testResults, stats);

        expect(core.summary.addHeading).toHaveBeenCalledTimes(2);
        expect(core.summary.addHeading).toHaveBeenNthCalledWith(1, 'MATLAB Test Results (' + process.env.GITHUB_ACTION + ')');
        expect(core.summary.addHeading).toHaveBeenNthCalledWith(2, 'All tests', 3);
        expect(core.summary.addRaw).toHaveBeenCalledTimes(2);
        expect(core.summary.write).toHaveBeenCalledTimes(1);
    });
});

describe('HTML Structure Tests', () => {
    it.each([
        [testResultsSummary.MatlabTestStatus.PASSED, '✅'],
        [testResultsSummary.MatlabTestStatus.FAILED, '❌'],
        [testResultsSummary.MatlabTestStatus.INCOMPLETE, '⚠️'],
        [testResultsSummary.MatlabTestStatus.NOT_RUN, '🚫']
    ])('should return %s emoji for %s status', (status, expectedEmoji) => {
        expect(testResultsSummary.getStatusEmoji(status)).toBe(expectedEmoji);
    });

    it('should generate valid HTML table structure for header', () => {
        const mockStats: testResultsSummary.TestStatistics = {
            total: 10,
            passed: 4,
            failed: 3,
            incomplete: 2,
            notRun: 1,
            duration: 1.83
        };
        
        const htmlHeader = testResultsSummary.getTestHeader([], mockStats);
        
        // Parse HTML with jsdom
        const dom = new JSDOM(htmlHeader);
        const document = dom.window.document;
        
        // Verify table exists
        const table = document.querySelector('table');
        expect(table).not.toBeNull();
        
        // Verify table has 2 rows (header + data)
        const rows = table?.querySelectorAll('tr');
        expect(rows?.length).toBe(2);
        
        // Verify header row has 6 columns
        const headerRow = rows?.[0];
        expect(headerRow?.children.length).toBe(6);
        expect(headerRow?.children[0]?.textContent).toBe('Total tests');
        expect(headerRow?.children[1]?.textContent).toBe('Passed ✅');
        expect(headerRow?.children[2]?.textContent).toBe('Failed ❌');
        expect(headerRow?.children[3]?.textContent).toBe('Incomplete ⚠️');
        expect(headerRow?.children[4]?.textContent).toBe('Not Run 🚫');
        expect(headerRow?.children[5]?.textContent).toBe('Duration(s) ⌛');
        
        // Verify data row has correct values
        const dataRow = rows?.[1];
        expect(dataRow?.children[0]?.textContent).toBe('10');
        expect(dataRow?.children[1]?.textContent).toBe('4');
        expect(dataRow?.children[2]?.textContent).toBe('3');
        expect(dataRow?.children[3]?.textContent).toBe('2');
        expect(dataRow?.children[4]?.textContent).toBe('1');
        expect(dataRow?.children[5]?.textContent).toBe('1.83');
    });

    it('should generate valid HTML for detailed results with proper details tags for both passed and failed tests', () => {
        const mockTestResults: testResultsSummary.MatlabTestFile[][] = [[
            {
                name: 'TestExamples1',
                path: 'tests/TestExamples1',
                duration: 1.5,
                status: testResultsSummary.MatlabTestStatus.FAILED,
                testCases: [
                    {
                        name: 'testFailedCase',
                        duration: 0.5,
                        status: testResultsSummary.MatlabTestStatus.FAILED,
                        diagnostics: [
                            {
                                event: 'TestFailure',
                                report: 'Expected 5 but got 4'
                            }
                        ]
                    }
                ]
            },
            {
                name: 'TestExamples2',
                path: 'tests/TestExamples2',
                duration: 0.3,
                status: testResultsSummary.MatlabTestStatus.PASSED,
                testCases: [
                    {
                        name: 'testPassedCase',
                        duration: 0.3,
                        status: testResultsSummary.MatlabTestStatus.PASSED,
                        diagnostics: []
                    }
                ]
            }
        ]];

        const htmlDetails = testResultsSummary.getDetailedResults(mockTestResults);
        
        // Parse HTML with jsdom
        const dom = new JSDOM(htmlDetails);
        const document = dom.window.document;
        
        // Verify table structure
        const table = document.querySelector('table');
        expect(table).not.toBeNull();
        
        // Get all details elements
        const detailsElements = document.querySelectorAll('details');
        expect(detailsElements.length).toBe(3); // 2 test files + 1 diagnostic
        
        // Verify failed test (first details element) has open attribute
        const failedTestDetails = detailsElements[0];
        expect(failedTestDetails.hasAttribute('open')).toBe(true);
        const failedTestSummary = failedTestDetails.querySelector('summary b');
        expect(failedTestSummary?.textContent).toContain('TestExamples1');
        expect(failedTestSummary?.textContent).toContain('❌');
        
        // Verify passed test (third details element; second element is for diagnostics) does NOT have open attribute
        const passedTestDetails = detailsElements[2];
        expect(passedTestDetails.hasAttribute('open')).toBe(false);
        const passedTestSummary = passedTestDetails.querySelector('summary b');
        expect(passedTestSummary?.textContent).toContain('TestExamples2');
        expect(passedTestSummary?.textContent).toContain('✅');
        
        // Verify test case details
        expect(htmlDetails).toContain('❌ testFailedCase');
        expect(htmlDetails).toContain('✅ testPassedCase');
        
        // Verify diagnostics details tag (second details element)
        const diagnosticsDetails = detailsElements[1];
        expect(diagnosticsDetails).not.toBeNull();
        expect(diagnosticsDetails.hasAttribute('open')).toBe(false); // diagnostics should be closed by default
        
        // Verify diagnostics summary and content
        const diagnosticsSummary = diagnosticsDetails.querySelector('summary');
        expect(diagnosticsSummary?.textContent).toBe('TestFailure');
        
        // Verify diagnostics report content
        const diagnosticsContent = diagnosticsDetails.querySelector('pre');
        expect(diagnosticsContent).not.toBeNull();
        expect(diagnosticsContent?.textContent?.trim()).toBe('Expected 5 but got 4');
        expect(diagnosticsContent?.getAttribute('style')).toContain('font-family: monospace');
        expect(diagnosticsContent?.getAttribute('style')).toContain('white-space: pre');
        
        // Verify diagnostics is nested within the failed test details
        const nestedDiagnostics = failedTestDetails.querySelector('table details');
        expect(nestedDiagnostics).toBe(diagnosticsDetails);
        
        // Verify durations
        expect(htmlDetails).toContain('<b>1.50</b>');
        expect(htmlDetails).toContain('<b>0.30</b>');
    });
});

describe('Error Handling Tests', () => {
    it('should handle errors gracefully in writeSummary', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        
        // Mock addHeading to throw an error
        (core.summary.addHeading as jest.Mock).mockImplementationOnce(() => {
            throw new Error('Mock error in addHeading');
        });
    
        const mockStats: testResultsSummary.TestStatistics = {
            total: 1, passed: 1, failed: 0, incomplete: 0, notRun: 0, duration: 0.5
        };
        const mockTestResults: testResultsSummary.MatlabTestFile[][] = [];
    
        // This should not throw, but should log the error
        expect(() => {
            testResultsSummary.writeSummary(mockTestResults, mockStats);
        }).not.toThrow();
    
        // Verify error was logged
        expect(consoleSpy).toHaveBeenCalledWith(
            'An error occurred while adding the test results to the summary:',
            expect.any(Error)
        );
    
        consoleSpy.mockRestore();
    });
    
    it('should handle JSON parsing errors gracefully', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        
        // Set up environment variables
        process.env.RUNNER_TEMP = path.join(__dirname, '..');
        process.env.GITHUB_RUN_ID = '';
        
        // Create a file with invalid JSON
        const invalidJsonPath = path.join(process.env.RUNNER_TEMP, 'matlabTestResults.json');
        fs.writeFileSync(invalidJsonPath, '{ invalid json content');
    
        try {
            const result = testResultsSummary.getTestResults();
            
            // Should return empty results
            expect(result.testResults).toEqual([]);
            expect(result.stats).toEqual({
                total: 0, passed: 0, failed: 0, incomplete: 0, notRun: 0, duration: 0
            });
    
            // Verify error was logged
            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('An error occurred while reading the test results summary file'),
                expect.any(Error)
            );
        } finally {
            // Clean up
            if (fs.existsSync(invalidJsonPath)) {
                fs.unlinkSync(invalidJsonPath);
            }
            consoleSpy.mockRestore();
        }
    });

    it('should handle file deletion errors gracefully', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        
        // Get the mocked function
        const mockedUnlinkSync = jest.mocked(fs.unlinkSync);
        
        // Set up the mock to throw an error for this test
        mockedUnlinkSync.mockImplementationOnce(() => {
            throw new Error('Permission denied - cannot delete file');
        });
    
        // Set up environment variables
        process.env.RUNNER_TEMP = path.join(__dirname, '..');
        process.env.GITHUB_RUN_ID = '';
        
        // Create a valid JSON file
        const validJsonPath = path.join(process.env.RUNNER_TEMP, 'matlabTestResults.json');
        fs.writeFileSync(validJsonPath, '[]'); // Empty array - valid JSON
    
        try {
            const result = testResultsSummary.getTestResults();
            
            // Should still return results even if deletion fails
            expect(result).toBeDefined();
            expect(result.testResults).toEqual([]);
    
            // Verify deletion error was logged
            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('An error occurred while trying to delete the test results summary file'),
                expect.any(Error)
            );

            // Verify unlinkSync was called
            expect(mockedUnlinkSync).toHaveBeenCalledWith(validJsonPath);
        } finally {
            // Clean up
            mockedUnlinkSync.mockRestore();
            consoleSpy.mockRestore();

            // Clean up the test file (use the real fs function)
            const realFs = jest.requireActual('fs');
            try {
                realFs.unlinkSync(validJsonPath);
            } catch (e) {
                // Ignore cleanup errors
            }
        }
    });
});
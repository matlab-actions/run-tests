// import { MatlabTestStatus, getTestResults, writeSummary } from './testResultsSummary';
// import * as core from '@actions/core';
// import { existsSync, writeFileSync, unlinkSync } from 'fs';
// import * as path from 'path';

// describe('Test Results Summary', () => {
//     const mockTestData = {
//         BaseFolder: '/test/path',
//         TestResult: {
//             Name: 'TestFile/TestCase1',
//             Duration: 1.234,
//             Failed: false,
//             Passed: true,
//             Incomplete: false,
//             Details: {
//                 DiagnosticRecord: {
//                     Event: 'Passed',
//                     Report: 'Test passed successfully'
//                 }
//             }
//         }
//     };

//     beforeEach(() => {
//         jest.spyOn(core.summary, 'addHeading').mockReturnThis();
//         jest.spyOn(core.summary, 'addRaw').mockReturnThis();
//         // jest.spyOn(core.summary, 'write').mockResolvedValue(true);
//     });

//     afterEach(() => {
//         jest.clearAllMocks();
//     });

//     test('writeSummary generates correct summary format', () => {
//         const testResults = [[{
//             name: 'TestFile',
//             path: '/test/path/TestFile',
//             testCases: [{
//                 name: 'TestCase1',
//                 duration: 1.234,
//                 status: MatlabTestStatus.PASSED,
//                 diagnostics: [{
//                     event: 'Passed',
//                     report: 'Test passed successfully'
//                 }]
//             }],
//             duration: 1.234,
//             status: MatlabTestStatus.PASSED
//         }]];

//         const counts = {
//             total: 1,
//             passed: 1,
//             failed: 0,
//             incomplete: 0,
//             notRun: 0
//         };

//         writeSummary(testResults, counts);

//         expect(core.summary.addHeading).toHaveBeenCalledWith('MATLAB Test Results');
//         expect(core.summary.addRaw).toHaveBeenCalledTimes(3);
//         expect(core.summary.write).toHaveBeenCalled();
//     });

//     test('getTestResults processes test data correctly', () => {
//         process.env.RUNNER_TEMP = '/tmp';
//         process.env.GITHUB_RUN_ID = '12345';

//         const resultsPath = path.join(process.env.RUNNER_TEMP, `matlabTestResults${process.env.GITHUB_RUN_ID}.json`);
//         writeFileSync(resultsPath, JSON.stringify([mockTestData]));

//         const { testResults, counts } = getTestResults('');

//         expect(counts.total).toBe(1);
//         expect(counts.passed).toBe(1);
//         expect(testResults).toHaveLength(1);
//         expect(testResults[0][0].testCases).toHaveLength(1);
//         expect(testResults[0][0].status).toBe(MatlabTestStatus.PASSED);

//         if (existsSync(resultsPath)) {
//             unlinkSync(resultsPath);
//         }
//     });

//     test('handles failed tests correctly', () => {
//         const failedTestData = {
//             ...mockTestData,
//             TestResult: {
//                 ...mockTestData.TestResult,
//                 Failed: true,
//                 Passed: false,
//                 Details: {
//                     DiagnosticRecord: {
//                         Event: 'Failed',
//                         Report: 'Test failed with error'
//                     }
//                 }
//             }
//         };

//         process.env.RUNNER_TEMP = '/tmp';
//         process.env.GITHUB_RUN_ID = '12345';

//         const resultsPath = path.join(process.env.RUNNER_TEMP, `matlabTestResults${process.env.GITHUB_RUN_ID}.json`);
//         writeFileSync(resultsPath, JSON.stringify([failedTestData]));

//         const { testResults, counts } = getTestResults('');

//         expect(counts.failed).toBe(1);
//         expect(testResults[0][0].status).toBe(MatlabTestStatus.FAILED);

//         if (existsSync(resultsPath)) {
//             unlinkSync(resultsPath);
//         }
//     });
// });
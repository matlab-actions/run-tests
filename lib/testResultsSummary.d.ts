export declare enum MatlabTestStatus {
    PASSED = "PASSED",
    FAILED = "FAILED",
    INCOMPLETE = "INCOMPLETE",
    NOT_RUN = "NOT_RUN"
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
export interface MatlabTestFile {
    name: string;
    path: string;
    testCases: MatlabTestCase[];
    duration: number;
    status: MatlabTestCase['status'];
}
export interface TestStatistics {
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
export declare function writeSummary(testResults: MatlabTestFile[][], stats: TestStatistics): void;
export declare function getTestHeader(testResults: MatlabTestFile[][], stats: TestStatistics): string;
export declare function getDetailedResults(testResults: MatlabTestFile[][]): string;
export declare function getStatusEmoji(status: MatlabTestStatus): string;
export declare function getTestResults(): TestResultsData;
export {};

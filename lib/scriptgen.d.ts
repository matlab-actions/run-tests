/**
 * Interface representing collection of test-related options to pass to
 * scriptgen.
 */
export interface RunTestsOptions {
    JUnitTestResults?: string;
    CoberturaCodeCoverage?: string;
    HTMLCodeCoverage?: string;
    SourceFolder?: string;
    PDFTestReport?: string;
    HTMLTestReport?: string;
    SimulinkTestResults?: string;
    CoberturaModelCoverage?: string;
    HTMLModelCoverage?: string;
    SelectByTag?: string;
    SelectByFolder?: string;
    Strict?: boolean;
    UseParallel?: boolean;
    OutputDetail?: string;
    LoggingLevel?: string;
}
/**
 * Generate scriptgen command for running tests.
 *
 * @param options scriptgen options for running tests.
 */
export declare function generateCommand(options: RunTestsOptions): string;

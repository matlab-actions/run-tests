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
    CodeCoverageMetrics?: string;
}
/**
 * Resolve the effective code coverage metrics from the new
 * `code-coverage-metrics` input and the deprecated `code-coverage-metric-level`
 * input. If the user leaves the new input at its "auto" default but specifies a
 * value for the deprecated input, the deprecated value takes precedence.
 *
 * @param metrics value of the `code-coverage-metrics` input.
 * @param metricLevel value of the deprecated `code-coverage-metric-level` input.
 */
export declare function resolveCodeCoverageMetrics(metrics: string, metricLevel: string): string;
/**
 * Generate scriptgen command for running tests.
 *
 * @param options scriptgen options for running tests.
 */
export declare function generateCommand(options: RunTestsOptions): string;

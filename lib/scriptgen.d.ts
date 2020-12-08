/**
 * Interface representing collection of test-related options to pass to
 * scriptgen.
 */
export interface RunTestsOptions {
    JUnitTestResults?: string;
    CoberturaCodeCoverage?: string;
    SourceFolder?: string;
}
/**
 * Generate scriptgen command for running tests.
 *
 * @param options scriptgen options for running tests.
 */
export declare function generateCommand(options: RunTestsOptions): string;

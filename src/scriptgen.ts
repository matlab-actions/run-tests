// Copyright 2020-2026 The MathWorks, Inc.

import * as path from "path";

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
export function resolveCodeCoverageMetrics(metrics: string, metricLevel: string): string {
    if (metrics === "auto" && metricLevel !== "auto") {
        return metricLevel;
    }
    return metrics;
}

function formatMetricsCellArray(metrics: string | undefined): string {
    if (!metrics || metrics.trim() === "") {
        return "{}";
    }
    const items = metrics
        .trim()
        .split(/\s+/)
        .map((m) => `'${m}'`)
        .join(",");
    return `{${items}}`;
}

/**
 * Generate scriptgen command for running tests.
 *
 * @param options scriptgen options for running tests.
 */
export function generateCommand(options: RunTestsOptions): string {
    const metricsCellArray = formatMetricsCellArray(options.CodeCoverageMetrics);
    const command = `
        addpath('${path.join(import.meta.dirname, "scriptgen")}');
        testScript = genscript('Test',
            'JUnitTestResults','${options.JUnitTestResults || ""}',
            'CoberturaCodeCoverage','${options.CoberturaCodeCoverage || ""}',
            'HTMLCodeCoverage','${options.HTMLCodeCoverage || ""}',
            'SourceFolder','${options.SourceFolder || ""}',
            'PDFTestReport','${options.PDFTestReport || ""}',
            'HTMLTestReport','${options.HTMLTestReport || ""}',
            'SimulinkTestResults','${options.SimulinkTestResults || ""}',
            'CoberturaModelCoverage','${options.CoberturaModelCoverage || ""}',
            'HTMLModelCoverage','${options.HTMLModelCoverage || ""}',
            'SelectByTag','${options.SelectByTag || ""}',
            'SelectByFolder','${options.SelectByFolder || ""}',
            'Strict',${options.Strict || false},
            'UseParallel',${options.UseParallel || false},
            'OutputDetail','${options.OutputDetail || ""}',
            'LoggingLevel','${options.LoggingLevel || ""}',
            'Metrics',${metricsCellArray}
            );
        disp('Running MATLAB script with contents:');
        disp(testScript.Contents);
        fprintf('__________\\n\\n');
        run(testScript);
    `
        .replace(/$\n^\s*/gm, " ")
        .trim(); // replace ending newlines and starting spaces
    return command;
}

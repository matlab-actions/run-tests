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

function formatMetricsCellArray(metrics: string | undefined): string {
    if (!metrics || metrics.trim() === "") {
        return "{}";
    }
    const items = metrics.trim().split(/\s+/).map(m => `'${m}'`).join(",");
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

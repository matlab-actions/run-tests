// Copyright 2020-2022 The MathWorks, Inc.

import * as path from "path";

/**
 * Interface representing collection of test-related options to pass to
 * scriptgen.
 */
export interface RunTestsOptions {
    JUnitTestResults?: string;
    CoberturaCodeCoverage?: string;
    SourceFolder?: string;
    PDFTestReport?: string;
    SimulinkTestResults?: string;
    CoberturaModelCoverage?: string;
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
export function generateCommand(options: RunTestsOptions): string {
    const command = `
        addpath('${path.join(__dirname, "scriptgen")}');
        testScript = genscript('Test',
            'JUnitTestResults','${options.JUnitTestResults || ""}',
            'CoberturaCodeCoverage','${options.CoberturaCodeCoverage || ""}',
            'SourceFolder','${options.SourceFolder || ""}',
            'PDFTestReport','${options.PDFTestReport || ""}',
            'SimulinkTestResults','${options.SimulinkTestResults || ""}',
            'CoberturaModelCoverage','${options.CoberturaModelCoverage || ""}',
            'SelectByTag','${options.SelectByTag || ""}',
            'SelectByFolder','${options.SelectByFolder || ""}',
            'Strict',${options.Strict || false},
            'UseParallel',${options.UseParallel || false},
            'OutputDetail','${options.OutputDetail || ""}',
            'LoggingLevel','${options.LoggingLevel || ""}'
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

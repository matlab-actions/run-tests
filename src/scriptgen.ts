// Copyright 2020 The MathWorks, Inc.

import * as path from "path";

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
export function generateCommand(options: RunTestsOptions): string {
    const command = `
        addpath('${path.join(__dirname, "scriptgen")}');
        testScript = genscript('Test',
            'JUnitTestResults','${options.JUnitTestResults || ""}',
            'CoberturaCodeCoverage','${options.CoberturaCodeCoverage || ""}',
            'SourceFolder','${options.SourceFolder || ""}');
        disp('Running MATLAB script with contents:');
        disp(strtrim(testScript.writeToText()));
        fprintf('__________\\n\\n');
        run(testScript);
    `
        .replace(/$\n^\s*/gm, " ")
        .trim(); // replace ending newlines and starting spaces
    return command;
}

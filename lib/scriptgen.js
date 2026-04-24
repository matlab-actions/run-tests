// Copyright 2020-2022 The MathWorks, Inc.
import * as path from "path";
/**
 * Generate scriptgen command for running tests.
 *
 * @param options scriptgen options for running tests.
 */
export function generateCommand(options) {
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
//# sourceMappingURL=scriptgen.js.map
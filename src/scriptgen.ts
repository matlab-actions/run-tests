import * as path from "path";

export interface RunTestsOptions {
    JUnitTestResults?: string;
    CoberturaCodeCoverage?: string;
    SourceFolder?: string;
}

export function generateCommand(options: RunTestsOptions): string {
    const command = `
        addpath('${path.join(__dirname, "scriptgen")}');
        testScript = genscript('Test','WorkingFolder','..',
            'JUnitTestResults','${options.JUnitTestResults || ""}',
            'CoberturaCodeCoverage','${options.CoberturaCodeCoverage || ""}',
            'SourceFolder','${options.SourceFolder || ""}');
        scriptFolder = '.matlab';
        scriptPath = fullfile(scriptFolder, 'runAllTests.m');
        testScript.writeToFile(scriptPath);
        disp(['Running ''' scriptPath ''':']);
        type(scriptPath);
        fprintf('__________\\n\\n');
        cd(scriptFolder);
        runAllTests;
    `.replace(/$\n^\s*/gm, " "); // replace ending newlines and starting spaces
    return command;
}

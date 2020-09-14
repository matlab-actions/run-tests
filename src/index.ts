// Copyright 2020 The MathWorks, Inc.

import * as core from "@actions/core";
import * as exec from "@actions/exec";
import { matlab } from "run-matlab-command-action";
import * as path from "path";

interface RunTestsOptions {
    JUnitTestResults?: string;
    CoberturaCodeCoverage?: string;
    SourceFolder?: string;
}

async function run() {
    const platform = process.platform;
    const workspaceDir = process.cwd();

    const options: RunTestsOptions = {
        JUnitTestResults: core.getInput("testResultsJUnit"),
        CoberturaCodeCoverage: core.getInput("codeCoverageCobertura"),
        SourceFolder: core.getInput("sourceFolder"),
    };

    const command = generateCommand(options);

    const helperScript = await core.group("Generate script", async () => {
        const helperScript = await matlab.generateScript(workspaceDir, command);
        core.info("Sucessfully generated script");
        return helperScript;
    });

    await core.group("Run command", async () => {
        await matlab.runCommand(helperScript, platform, exec.exec);
    });
}

function generateCommand(options: RunTestsOptions): string {
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

run().catch((e) => {});

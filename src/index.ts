// Copyright 2020 The MathWorks, Inc.

import * as core from "@actions/core";
import * as exec from "@actions/exec";
import { matlab } from "run-matlab-command-action";
import * as scriptgen from "./scriptgen";

async function run() {
    const platform = process.platform;
    const workspaceDir = process.cwd();

    const options: scriptgen.RunTestsOptions = {
        JUnitTestResults: core.getInput("test-results-junit"),
        CoberturaCodeCoverage: core.getInput("code-coverage-cobertura"),
        SourceFolder: core.getInput("source-folder"),
    };

    const command = scriptgen.generateCommand(options);

    const helperScript = await core.group("Generate script", async () => {
        const helperScript = await matlab.generateScript(workspaceDir, command);
        core.info("Sucessfully generated script");
        return helperScript;
    });

    await core.group("Run command", async () => {
        await matlab.runCommand(helperScript, platform, exec.exec);
    });
}

run().catch((e) => {});

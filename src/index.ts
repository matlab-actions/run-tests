// Copyright 2020-2025 The MathWorks, Inc.

import * as core from "@actions/core";
import * as exec from "@actions/exec";
import { matlab } from "run-matlab-command-action";
import * as scriptgen from "./scriptgen";
import { testResultsSummary } from "common-utils";
import * as path from "path";

/**
 * Gather action inputs and then run action
 */
async function run() {
    const platform = process.platform;
    const architecture = process.arch;
    const workspaceDir = process.cwd();

    const options: scriptgen.RunTestsOptions = {
        JUnitTestResults: core.getInput("test-results-junit"),
        CoberturaCodeCoverage: core.getInput("code-coverage-cobertura"),
        HTMLCodeCoverage: core.getInput("code-coverage-html"),
        SourceFolder: core.getInput("source-folder"),
        PDFTestReport: core.getInput("test-results-pdf"),
        HTMLTestReport: core.getInput("test-results-html"),
        SimulinkTestResults: core.getInput("test-results-simulink-test"),
        CoberturaModelCoverage: core.getInput("model-coverage-cobertura"),
        HTMLModelCoverage: core.getInput("model-coverage-html"),
        SelectByTag: core.getInput("select-by-tag"),
        SelectByFolder: core.getInput("select-by-folder"),
        Strict: core.getBooleanInput("strict"),
        UseParallel: core.getBooleanInput("use-parallel"),
        OutputDetail: core.getInput("output-detail"),
        LoggingLevel: core.getInput("logging-level"),
    };

    const pluginsPath = path.join(__dirname, "plugins").replaceAll("'","''");
    const command = "addpath('"+ pluginsPath +"'); " + scriptgen.generateCommand(options);
    const startupOptions = core.getInput("startup-options").split(" ");

    const helperScript = await matlab.generateScript(workspaceDir, command);
    core.info("Successfully generated test script!");

    await matlab.runCommand(helperScript, platform, architecture, exec.exec, startupOptions).finally(() => {
        const testResultsData = testResultsSummary.getTestResults(process.env.RUNNER_TEMP || '', process.env.GITHUB_RUN_ID || '', workspaceDir);
        testResultsSummary.writeSummary(testResultsData, process.env.GITHUB_ACTION || '');
    });
}

run().catch((e) => {
    core.setFailed(e);
});

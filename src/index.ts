// Copyright 2020-2023 The MathWorks, Inc.

import * as core from "@actions/core";
import * as exec from "@actions/exec";
import { matlab } from "run-matlab-command-action";
import * as scriptgen from "./scriptgen";
import * as testResultsSummary from "./testResultsSummary";
import * as path from "path";

/**
 * Gather action inputs and then run action.
 */
async function run() {
    const platform = process.platform;
    const architecture = process.arch;
    const workspaceDir = process.cwd();

    const options: scriptgen.RunTestsOptions = {
        JUnitTestResults: core.getInput("test-results-junit"),
        CoberturaCodeCoverage: core.getInput("code-coverage-cobertura"),
        SourceFolder: core.getInput("source-folder"),
        PDFTestReport: core.getInput("test-results-pdf"),
        SimulinkTestResults: core.getInput("test-results-simulink-test"),
        CoberturaModelCoverage: core.getInput("model-coverage-cobertura"),
        SelectByTag: core.getInput("select-by-tag"),
        SelectByFolder: core.getInput("select-by-folder"),
        Strict: core.getBooleanInput("strict"),
        UseParallel: core.getBooleanInput("use-parallel"),
        OutputDetail: core.getInput("output-detail"),
        LoggingLevel: core.getInput("logging-level"),
    };

    // Once new scriptgen version is live, line 34-44 will be updated before release
    // const command = scriptgen.generateCommand(options);
    const pluginsPath = path.join(__dirname, "plugins").replace("'","''");
    const command = "addpath('"+ pluginsPath +"');" +
        "import matlab.unittest.TestRunner;" +
        "addpath(genpath('sample'));" +
        "suite = testsuite(pwd, 'IncludeSubfolders', true);" +
        "runner = TestRunner.withDefaultPlugins();" +
        "results = runner.run(suite);" +
        "results = runner.run(suite);" +
        "display(results);" +
        "assertSuccess(results);";
    const startupOptions = core.getInput("startup-options").split(" ");

    const helperScript = await matlab.generateScript(workspaceDir, command);
    core.info("Successfully generated test script!");

    await matlab.runCommand(helperScript, platform, architecture, exec.exec, startupOptions).finally(() => {
        const { testResults, stats } = testResultsSummary.getTestResults();
        testResultsSummary.writeSummary(testResults, stats);
    });
}

run().catch((e) => {
    core.setFailed(e);
});

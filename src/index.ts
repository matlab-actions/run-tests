// Copyright 2020-2026 The MathWorks, Inc.

import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as scriptgen from "./scriptgen.js";
import { matlab, testResultsSummary } from "common-utils";

/**
 * Gather action inputs and then run action
 */
async function run() {
    const platform = process.platform;
    const architecture = process.arch;
    const workspaceDir = process.cwd();

    var codeCoverageMetrics = core.getInput("code-coverage-metrics").toLowerCase().trim();
    const codeCoverageMetricLevel = core
        .getInput("code-coverage-metric-level")
        .toLowerCase()
        .trim();
    // If the user has specified a code coverage metric level, use that instead of default "auto" for the code coverage metrics.
    if (codeCoverageMetrics === "auto" && codeCoverageMetricLevel !== "auto") {
        codeCoverageMetrics = codeCoverageMetricLevel;
    }

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
        CodeCoverageMetrics: codeCoverageMetrics,
    };

    const generateSummary = core.getBooleanInput("generate-summary");

    const command = scriptgen.generateCommand(options);
    const startupOptions = core.getInput("startup-options").split(" ");

    const helperScript = await matlab.generateScript(workspaceDir, command);
    const execOptions = {
        env: {
            ...process.env,
            MW_BATCH_LICENSING_ONLINE: "true", // Remove when online batch licensing is the default
            MW_INPUT_CODE_COVERAGE_METRICS: options.CodeCoverageMetrics!,
            MW_INPUT_SOURCE_FOLDER: options.SourceFolder!, // Add source folder to environment
            MW_INPUT_CODE_COVERAGE_HTML: options.HTMLCodeCoverage!,
            MW_INPUT_CODE_COVERAGE_COBERTURA: options.CoberturaCodeCoverage!,
            MW_INPUT_GENERATE_SUMMARY: String(generateSummary),
        },
    };
    core.info("Successfully generated test script!");

    await matlab
        .runCommand(
            helperScript,
            platform,
            architecture,
            (cmd, args) => exec.exec(cmd, args, execOptions),
            startupOptions,
        )
        .finally(() => {
            if (generateSummary) {
                const runnerTemp = process.env.RUNNER_TEMP || "";
                const runId = process.env.GITHUB_RUN_ID || "";
                const actionName = process.env.GITHUB_ACTION || "";

                testResultsSummary.processAndAddTestSummary(
                    runnerTemp,
                    runId,
                    actionName,
                    workspaceDir,
                );
                core.summary.write();
            }
        });
}

run().catch((e) => {
    core.setFailed(e);
});

"use strict";
// Copyright 2020-2023 The MathWorks, Inc.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
const run_matlab_command_action_1 = require("run-matlab-command-action");
const scriptgen = __importStar(require("./scriptgen"));
const testResultsSummary = __importStar(require("./testResultsSummary"));
const path = __importStar(require("path"));
/**
 * Gather action inputs and then run action.
 */
async function run() {
    const platform = process.platform;
    const architecture = process.arch;
    const workspaceDir = process.cwd();
    const options = {
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
    const pluginsPath = path.join(__dirname, "plugins").replaceAll("'", "''");
    const command = "addpath('" + pluginsPath + "'); " + scriptgen.generateCommand(options);
    // TODO: Remove these lines before merging to main branch
    //     "import matlab.unittest.TestRunner;" +
    //     "addpath(genpath('sample'));" +
    //     "suite = testsuite(pwd, 'IncludeSubfolders', true);" +
    //     "runner = TestRunner.withDefaultPlugins();" +
    //     "results = runner.run(suite);" +
    //     "results = runner.run(suite);" +
    //     "display(results);" +
    //     "assertSuccess(results);";
    const startupOptions = core.getInput("startup-options").split(" ");
    const helperScript = await run_matlab_command_action_1.matlab.generateScript(workspaceDir, command);
    core.info("Successfully generated test script!");
    await run_matlab_command_action_1.matlab.runCommand(helperScript, platform, architecture, exec.exec, startupOptions).finally(() => {
        const { testResults, stats } = testResultsSummary.getTestResults();
        testResultsSummary.writeSummary(testResults, stats);
    });
}
run().catch((e) => {
    core.setFailed(e);
});
//# sourceMappingURL=index.js.map
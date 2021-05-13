"use strict";
// Copyright 2020 The MathWorks, Inc.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
const run_command_1 = require("run-command");
const scriptgen = __importStar(require("./scriptgen"));
/**
 * Gather action inputs and then run action.
 */
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const platform = process.platform;
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
        };
        const command = scriptgen.generateCommand(options);
        const helperScript = yield core.group("Generate script", () => __awaiter(this, void 0, void 0, function* () {
            const helperScript = yield run_command_1.matlab.generateScript(workspaceDir, command);
            core.info("Successfully generated script");
            return helperScript;
        }));
        yield core.group("Run command", () => __awaiter(this, void 0, void 0, function* () {
            yield run_command_1.matlab.runCommand(helperScript, platform, exec.exec);
        }));
    });
}
run().catch((e) => {
    core.setFailed(e);
});
//# sourceMappingURL=index.js.map
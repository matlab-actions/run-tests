"use strict";
// Copyright 2020-2022 The MathWorks, Inc.
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
exports.generateCommand = generateCommand;
const path = __importStar(require("path"));
/**
 * Generate scriptgen command for running tests.
 *
 * @param options scriptgen options for running tests.
 */
function generateCommand(options) {
    const command = `
        addpath('${path.join(__dirname, "scriptgen")}');
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
// Copyright 2020-2022 The MathWorks, Inc.

import * as scriptgen from "./scriptgen";

describe("command generation", () => {
    it("contains genscript invocation with unspecified options", () => {
        const options: scriptgen.RunTestsOptions = {
            JUnitTestResults: "",
            CoberturaCodeCoverage: "",
            HTMLCodeCoverage: "",
            SourceFolder: "",
            PDFTestReport: "",
            HTMLTestReport: "",
            SimulinkTestResults: "",
            CoberturaModelCoverage: "",
            HTMLModelCoverage: "",
            SelectByTag: "",
            SelectByFolder: "",
            Strict: false,
            UseParallel: false,
            OutputDetail: "",
            LoggingLevel: "",
        };

        const actual = scriptgen.generateCommand(options);

        expect(actual.includes("genscript('Test'")).toBeTruthy();
        expect(actual.includes("'JUnitTestResults',''")).toBeTruthy();
        expect(actual.includes("'CoberturaCodeCoverage',''")).toBeTruthy();
        expect(actual.includes("'HTMLCodeCoverage',''")).toBeTruthy();
        expect(actual.includes("'SourceFolder',''")).toBeTruthy();
        expect(actual.includes("'PDFTestReport',''")).toBeTruthy();
        expect(actual.includes("'HTMLTestReport',''")).toBeTruthy();
        expect(actual.includes("'SimulinkTestResults',''")).toBeTruthy();
        expect(actual.includes("'CoberturaModelCoverage',''")).toBeTruthy();
        expect(actual.includes("'HTMLModelCoverage',''")).toBeTruthy();
        expect(actual.includes("'SelectByTag',''")).toBeTruthy();
        expect(actual.includes("'SelectByFolder',''")).toBeTruthy();
        expect(actual.includes("'Strict',false")).toBeTruthy();
        expect(actual.includes("'UseParallel',false")).toBeTruthy();
        expect(actual.includes("'OutputDetail',''")).toBeTruthy();
        expect(actual.includes("'LoggingLevel',''")).toBeTruthy();

        const expected = `genscript('Test', 'JUnitTestResults','', 'CoberturaCodeCoverage','', 'HTMLCodeCoverage','', 
        'SourceFolder','', 'PDFTestReport','', 'HTMLTestReport','', 'SimulinkTestResults','', 
        'CoberturaModelCoverage','', 'HTMLModelCoverage','', 'SelectByTag','', 'SelectByFolder','', 
        'Strict',false, 'UseParallel',false, 'OutputDetail','', 'LoggingLevel','')`
        .replace(/\s+/g, "");
        expect(actual.replace(/\s+/g, "").includes(expected)).toBeTruthy();
    });

    it("contains genscript invocation with all options specified", () => {
        const options: scriptgen.RunTestsOptions = {
            JUnitTestResults: "test-results/results.xml",
            CoberturaCodeCoverage: "code-coverage/coverage.xml",
            HTMLCodeCoverage: "code-coverage/coverage.html",
            SourceFolder: "source",
            PDFTestReport: "test-results/pdf-results.pdf",
            HTMLTestReport: "test-results/html-results.html",
            SimulinkTestResults: "test-results/simulinkTest.mldatx",
            CoberturaModelCoverage: "test-results/modelcoverage.xml",
            HTMLModelCoverage: "test-results/modelcoverage.html",
            SelectByTag: "FeatureA",
            SelectByFolder: "test/tools;test/toolbox",
            Strict: true,
            UseParallel: true,
            OutputDetail: "Detailed",
            LoggingLevel: "Detailed",
        };

        const actual = scriptgen.generateCommand(options);

        expect(actual.includes("genscript('Test'")).toBeTruthy();
        expect(actual.includes("'JUnitTestResults','test-results/results.xml'")).toBeTruthy();
        expect(
            actual.includes("'CoberturaCodeCoverage','code-coverage/coverage.xml'")
        ).toBeTruthy();
        expect(
            actual.includes("'HTMLCodeCoverage','code-coverage/coverage.html'")
        ).toBeTruthy();
        expect(actual.includes("'SourceFolder','source'")).toBeTruthy();
        expect(actual.includes("'PDFTestReport','test-results/pdf-results.pdf'")).toBeTruthy();
        expect(actual.includes("'HTMLTestReport','test-results/html-results.html'")).toBeTruthy();
        expect(
            actual.includes("'SimulinkTestResults','test-results/simulinkTest.mldatx'")
        ).toBeTruthy();
        expect(
            actual.includes("'CoberturaModelCoverage','test-results/modelcoverage.xml'")
        ).toBeTruthy();
        expect(
            actual.includes("'HTMLModelCoverage','test-results/modelcoverage.html'")
        ).toBeTruthy();
        expect(actual.includes("'SelectByTag','FeatureA'")).toBeTruthy();
        expect(actual.includes("'SelectByFolder','test/tools;test/toolbox'")).toBeTruthy();
        expect(actual.includes("'Strict',true")).toBeTruthy();
        expect(actual.includes("'UseParallel',true")).toBeTruthy();
        expect(actual.includes("'OutputDetail','Detailed'")).toBeTruthy();
        expect(actual.includes("'LoggingLevel','Detailed'")).toBeTruthy();

        const expected = `genscript('Test', 
        'JUnitTestResults','test-results/results.xml', 
        'CoberturaCodeCoverage','code-coverage/coverage.xml',
        'HTMLCodeCoverage','code-coverage/coverage.html', 
        'SourceFolder','source',
        'PDFTestReport','test-results/pdf-results.pdf', 
        'HTMLTestReport','test-results/html-results.html', 
        'SimulinkTestResults','test-results/simulinkTest.mldatx',
        'CoberturaModelCoverage','test-results/modelcoverage.xml', 
        'HTMLModelCoverage','test-results/modelcoverage.html', 
        'SelectByTag','FeatureA', 
        'SelectByFolder','test/tools;test/toolbox', 
        'Strict',true, 
        'UseParallel',true, 
        'OutputDetail','Detailed', 
        'LoggingLevel','Detailed' )`
        .replace(/\s+/g, "");
        expect(actual.replace(/\s+/g, "").includes(expected)).toBeTruthy();
    });
});

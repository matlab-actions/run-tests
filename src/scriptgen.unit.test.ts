// Copyright 2020 The MathWorks, Inc.

import * as scriptgen from "./scriptgen";

describe("command generation", () => {
    it("contains genscript invocation with unspecified options", () => {
        const options: scriptgen.RunTestsOptions = {
            JUnitTestResults: "",
            CoberturaCodeCoverage: "",
            SourceFolder: "",
            PDFTestReport:"",
            SimulinkTestResults:"",
            CoberturaModelCoverage:"",
            SelectByTag:"",
            SelectByFolder:""
        };

        const actual = scriptgen.generateCommand(options);
        
        expect(actual.includes("genscript('Test'")).toBeTruthy();

        expect(actual.includes("'JUnitTestResults',''")).toBeTruthy();

        expect(actual.includes("'CoberturaCodeCoverage',''")).toBeTruthy();

        expect(actual.includes("'SourceFolder',''")).toBeTruthy();

        expect(actual.includes("'PDFTestReport',''")).toBeTruthy();
        
        expect(actual.includes("'SimulinkTestResults',''")).toBeTruthy();

        expect(actual.includes("'SelectByTag',''")).toBeTruthy();
        
    });

    it("contains genscript invocation with all options specified", () => {
        const options: scriptgen.RunTestsOptions = {
            JUnitTestResults: "test-results/results.xml",
            CoberturaCodeCoverage: "code-coverage/coverage.xml",
            SourceFolder: "source",
            PDFTestReport: "test-results/pdf-results.pdf",
            SimulinkTestResults: "test-results/simulinkTest.mldatx",
            SelectByTag: "FeatureA",
            SelectByFolder: "test/tools;test/toolbox"
        };
        
        const actual = scriptgen.generateCommand(options);
        console.log(actual);
        expect(actual.includes("genscript('Test'")).toBeTruthy();

        expect(actual.includes("'JUnitTestResults','test-results/results.xml'")).toBeTruthy();

        expect(actual.includes("'CoberturaCodeCoverage','code-coverage/coverage.xml'")).toBeTruthy();

        expect(actual.includes("'SourceFolder','source'")).toBeTruthy();
       
        expect(actual.includes("'PDFTestReport','test-results/pdf-results.pdf'")).toBeTruthy();
        
        expect(actual.includes("'SimulinkTestResults','test-results/simulinkTest.mldatx'")).toBeTruthy();

        expect(actual.includes("'SelectByTag','FeatureA'")).toBeTruthy();

        expect(actual.includes("'SelectByFolder','test/tools;test/toolbox'")).toBeTruthy();

    });
});

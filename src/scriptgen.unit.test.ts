// Copyright 2020 The MathWorks, Inc.

import * as scriptgen from "./scriptgen";
import * as testData from "./scriptgen_data.unit.test.json";

describe("command generation", () => {
    it("works with blank input", () => {
        const options: scriptgen.RunTestsOptions = {
            JUnitTestResults: "",
            CoberturaCodeCoverage: "",
            SourceFolder: "",
        };

        const actual = scriptgen.generateCommand(options);
        expect(actual.includes(testData.noInputs)).toBeTruthy();
    });

    it("works with inputs", () => {
        const options: scriptgen.RunTestsOptions = {
            JUnitTestResults: "test-results/results.xml",
            CoberturaCodeCoverage: "code-coverage/coverage.xml",
            SourceFolder: "source",
        };

        const actual = scriptgen.generateCommand(options);
        expect(actual.includes(testData.allInputs)).toBeTruthy();
    });
});

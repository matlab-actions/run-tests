// Copyright 2020 The MathWorks, Inc.

import * as scriptgen from "./scriptgen";

describe("command generation", () => {
    it("works with blank input", () => {
        const options: scriptgen.RunTestsOptions = {
            JUnitTestResults: "",
            CoberturaCodeCoverage: "",
            SourceFolder: "",
        };

        const actual = scriptgen.generateCommand(options);
        expect(actual).toBeDefined();
    });
});

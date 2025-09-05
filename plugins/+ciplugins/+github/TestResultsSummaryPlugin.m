classdef TestResultsSummaryPlugin < matlab.unittest.plugins.TestRunnerPlugin
    % Copyright 2025 The MathWorks, Inc.
    
    methods (Access=protected)
        function reportFinalizedSuite(plugin, pluginData)
            % Checkout MATLAB Test license
            license('checkout', 'matlab_test');

            testDetails = struct([]);
            for idx = 1:numel(pluginData.TestResult)
                testDetails(idx).TestResult = pluginData.TestResult(idx);
                testDetails(idx).BaseFolder = pluginData.TestSuite(idx).BaseFolder;
            end

            % If test results artifact exists, update the same file
            testArtifactFile = fullfile(getenv("RUNNER_TEMP"),"matlabTestResults" + getenv("GITHUB_RUN_ID") + ".json");
            if isfile(testArtifactFile)
                testResults = {jsondecode(fileread(testArtifactFile))};
            else
                testResults = {};
            end
            testResults{end+1} = testDetails;
            JsonTestResults = jsonencode(testResults, "PrettyPrint", true);

            [fID, msg] = fopen(testArtifactFile, "w");
            if fID == -1
                warning("ciplugins:github:TestResultsSummaryPlugin:UnableToOpenFile","Could not open a file for GitHub tests result table due to: %s", msg);
            else
                closeFile = onCleanup(@()fclose(fID));
                fprintf(fID, '%s', JsonTestResults);
            end

            % Invoke the superclass method
            reportFinalizedSuite@matlab.unittest.plugins.TestRunnerPlugin(plugin, pluginData);
        end
    end
end
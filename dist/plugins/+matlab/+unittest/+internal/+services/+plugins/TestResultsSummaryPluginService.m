classdef TestResultsSummaryPluginService < matlab.buildtool.internal.services.ciplugins.CITestRunnerPluginService
    % Copyright 2025 The MathWorks, Inc.

    methods
        function plugins = providePlugins(~, ~)
            % Check if MATLAB Test license is available
            if strcmpi(getenv("MW_INPUT_GENERATE_SUMMARY"), "true") && license('test', 'matlab_test')
                plugins = testframework.TestResultsSummaryPlugin();
            else
                plugins = matlab.unittest.plugins.TestRunnerPlugin.empty(1,0);
            end
        end
    end
end
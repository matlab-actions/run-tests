classdef TestResultsSummaryPluginService < matlab.buildtool.internal.services.ciplugins.CITestRunnerPluginService
    % Copyright 2025 The MathWorks, Inc.

    methods
        function plugins = providePlugins(~, ~)
            % Check if MATLAB Test license is available
            if license('test', 'matlab_test')
                plugins = ciplugins.github.TestResultsSummaryPlugin();
            else
                plugins = matlab.unittest.plugins.TestRunnerPlugin.empty(1,0);
            end
        end
    end
end
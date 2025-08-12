classdef GitHubLogPlugin < matlab.unittest.plugins.TestRunnerPlugin
    % Copyright 2025 The MathWorks, Inc.
    
    methods (Access=protected)
        function runTestClass(plugin, pluginData)
            % Add GitHub workflow command for starting a test output group
            disp("::group::Class " + pluginData.Name);

            % Invoke the superclass method
            runTestClass@matlab.unittest.plugins.TestRunnerPlugin(plugin, pluginData);

            % End the test output group
           disp("\n::endgroup::");
        end

        function runTest(plugin, pluginData)
            % Add GitHub workflow command for starting a test output group
            disp("::group::" + pluginData.TestSuite.Name);

            % Invoke the superclass method
            runTest@matlab.unittest.plugins.TestRunnerPlugin(plugin, pluginData);

            % End the test output group
           disp("\n::endgroup::");
        end
    end
end
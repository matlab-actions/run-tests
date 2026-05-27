classdef GitHubLogTestPlugin < matlab.unittest.plugins.TestRunnerPlugin
    % Copyright 2025 The MathWorks, Inc.
    
    methods (Access=protected)
        function runTestClass(plugin, pluginData)
            % Add GitHub workflow command for starting a test class output group
            disp("::group::" + pluginData.Name);

            % Invoke the superclass method
            runTestClass@matlab.unittest.plugins.TestRunnerPlugin(plugin, pluginData);

            % End the test class output group
           disp("::endgroup::");
        end
    end
end
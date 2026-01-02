classdef CodeCoverageSummaryPluginService < matlab.buildtool.internal.services.ciplugins.CITestRunnerPluginService
    % Copyright 2025 The MathWorks, Inc.
    
    methods
        function plugins = providePlugins(~, ~)
            % Check if MATLAB Test license is available
            if license('test', 'matlab_test')
                % Create a shared CoverageResult format object
                format = matlab.unittest.plugins.codecoverage.CoverageResult;
                
                % Create an array to hold multiple plugins
                plugins = matlab.unittest.plugins.TestRunnerPlugin.empty(0);
                
                % Include MC/DC coverage metrics
                
                
                %coveragePlugin = matlab.unittest.plugins.CodeCoveragePlugin.forFile(...
                %    targetFile, 'Producing', format, 'MetricLevel', 'mcdc');

            
                
                %addpath("C:\Users\tagupta\Downloads\common-utils\plugins\sourceFolder");
                
                coveragePlugin = matlab.unittest.plugins.CodeCoveragePlugin.forFolder(...
                    "../../sample", 'Producing', format, 'MetricLevel', 'mcdc');

                plugins(end+1) = coveragePlugin;
                
                % Add the summary plugin with the same format object
                summaryPlugin = testframework.CodeCoverageSummaryPlugin(format);
                plugins(end+1) = summaryPlugin;
            else
                plugins = matlab.unittest.plugins.TestRunnerPlugin.empty(1,0);
            end
        end
    end
end

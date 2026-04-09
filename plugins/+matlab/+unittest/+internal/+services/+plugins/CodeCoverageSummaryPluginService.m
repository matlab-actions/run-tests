classdef CodeCoverageSummaryPluginService < matlab.buildtool.internal.services.ciplugins.CITestRunnerPluginService
    % Copyright 2026 The MathWorks, Inc.
    
    methods
        function plugins = providePlugins(~, ~)

            disp("matlab_test");
            disp(ver('matlab_test'));
            disp("MATLAB_Test");
            disp(ver('MATLAB_Test'));
            % Check if matlab_test toolbox is installed and MATLAB Test license is available
            if  ~isempty(ver('MATLAB_Test')) && license('test', 'matlab_test')
                
                % Get metric level from environment variable
                metricLevel = getenv('INPUT_CODE_COVERAGE_METRIC_LEVEL');

                % Create a shared CoverageResult format object
                format = matlab.unittest.plugins.codecoverage.CoverageResult;
                
                % Create an array to hold multiple plugins
                plugins = matlab.unittest.plugins.TestRunnerPlugin.empty(0);
                
                % Get source folder from environment variable
                sourceFolder = getenv('INPUT_SOURCE_FOLDER');
                if isempty(sourceFolder)
                    sourceFolder = pwd;
                end
                
                coveragePlugin = matlab.unittest.plugins.CodeCoveragePlugin.forFolder(...
                    sourceFolder, 'Producing', format, 'MetricLevel', metricLevel);

                plugins(end+1) = coveragePlugin;
                
                % Add the summary plugin with the same format object
                summaryPlugin = testframework.CodeCoverageSummaryPlugin(format, metricLevel);
                plugins(end+1) = summaryPlugin;
            else
                plugins = matlab.unittest.plugins.TestRunnerPlugin.empty(1,0);
            end
        end
    end
end

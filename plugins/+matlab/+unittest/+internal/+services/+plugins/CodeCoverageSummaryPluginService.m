classdef CodeCoverageSummaryPluginService < matlab.buildtool.internal.services.ciplugins.CITestRunnerPluginService
    % Copyright 2025 The MathWorks, Inc.
    
    methods
        function plugins = providePlugins(~, ~)
            % Check if code coverage summary is enabled via environment variable
            coverageSummaryEnabled = false;
            envValue = getenv('INPUT_CODE_COVERAGE_SUMMARY_VIEW');
            if ~isempty(envValue) && strcmpi(envValue, 'true')
                coverageSummaryEnabled = true;
            end
            % Check if MATLAB Test license is available
            if license('test', 'matlab_test') && coverageSummaryEnabled
                
            % Get metric level from environment variable
                metricLevel = getenv('INPUT_CODE_COVERAGE_METRIC_LEVEL');
                if isempty(metricLevel)
                    metricLevel = 'mcdc';
                end
                
                % Validate metric level
                % validMetricLevels = {'statement', 'decision', 'condition', 'mcdc'};
                % if ~ismember(lower(metricLevel), validMetricLevels)
                %     warning('CodeCoverageSummaryPlugin:InvalidMetricLevel', ...
                %         'Invalid metric level "%s". Using default "mcdc".', metricLevel);
                %     metricLevel = 'mcdc';
                % end
                
                % Create a shared CoverageResult format object
                format = matlab.unittest.plugins.codecoverage.CoverageResult;
                
                % Create an array to hold multiple plugins
                plugins = matlab.unittest.plugins.TestRunnerPlugin.empty(0);
                
                % Include MC/DC coverage metrics
                
                
                %coveragePlugin = matlab.unittest.plugins.CodeCoveragePlugin.forFile(...
                %    targetFile, 'Producing', format, 'MetricLevel', 'mcdc');
                disp("IN SERVICE CLASS metric is");
                disp(metricLevel);
                sourceFolder = fullfile(pwd, 'sample');
                coveragePlugin = matlab.unittest.plugins.CodeCoveragePlugin.forFolder(...
                    sourceFolder, 'Producing', format, 'MetricLevel', lower(metricLevel));

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

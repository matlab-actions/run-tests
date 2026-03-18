classdef CodeCoverageSummaryPluginService < matlab.buildtool.internal.services.ciplugins.CITestRunnerPluginService
    % Copyright 2025 The MathWorks, Inc.
    
    methods
        function plugins = providePlugins(~, ~)

            % Check if MATLAB Test license is available
            if license('test', 'matlab_test') 
                
            % Get metric level from environment variable
                metricLevel = getenv('INPUT_CODE_COVERAGE_METRIC_LEVEL');
                if isempty(metricLevel)
                    metricLevel = 'mcdc';
                end
                
                % Create a shared CoverageResult format object
                format = matlab.unittest.plugins.codecoverage.CoverageResult;
                
                % Create an array to hold multiple plugins
                plugins = matlab.unittest.plugins.TestRunnerPlugin.empty(0);
                
                % sourceFolder = fullfile(pwd, 'sample');
                % Get source folder from environment variable
                sourceFolder = getenv('INPUT_SOURCE_FOLDER');
                % if isempty(sourceFolder)
                %     % Fallback to current working directory if not specified
                %     sourceFolder = pwd;
                %     warning('CodeCoverageSummaryPluginService:NoSourceFolder', ...
                %         'No source folder specified. Using current directory: %s', sourceFolder);
                % else
                %     % Convert to absolute path if it's relative
                %     if ~isfolder(sourceFolder)
                %         % Try as relative path from pwd
                %         absolutePath = fullfile(pwd, sourceFolder);
                %         if isfolder(absolutePath)
                %             sourceFolder = absolutePath;
                %         else
                %             warning('CodeCoverageSummaryPluginService:InvalidSourceFolder', ...
                %                 'Source folder "%s" does not exist. Using current directory.', sourceFolder);
                %             sourceFolder = pwd;
                %         end
                %     end
                % end
                
                disp(['Using source folder for coverage: ' sourceFolder]);
                coveragePlugin = matlab.unittest.plugins.CodeCoveragePlugin.forFolder(...
                    sourceFolder, 'Producing', format, 'MetricLevel', lower(metricLevel));

                plugins(end+1) = coveragePlugin;
                
                % Add the summary plugin with the same format object
                summaryPlugin = testframework.CodeCoverageSummaryPlugin(format, lower(metricLevel));
                plugins(end+1) = summaryPlugin;
            else
                plugins = matlab.unittest.plugins.TestRunnerPlugin.empty(1,0);
            end
        end
    end
end

%{
classdef CodeCoverageSummaryPluginService < matlab.buildtool.internal.services.ciplugins.CITestRunnerPluginService
    % Copyright 2026 The MathWorks, Inc.
    
    methods
        function plugins = providePlugins(~, ~)
            hasCoverageHTML = ~isempty(getenv('MW_INPUT_CODE_COVERAGE_HTML'));
            hasCoverageCobertura = ~isempty(getenv('MW_INPUT_CODE_COVERAGE_COBERTURA'));
            hasCoverageRequest = hasCoverageHTML || hasCoverageCobertura;

            metricsStr = strtrim(getenv('MW_INPUT_CODE_COVERAGE_METRICS'));
            if strcmpi(getenv("MW_INPUT_GENERATE_SUMMARY"), "true") && ~hasCoverageRequest && ~isempty(metricsStr)
                % Parse metrics from environment variable (space-separated)
                metrics = strsplit(strtrim(metricsStr));

                % Resolve 'auto' to appropriate metrics
                if isscalar(metrics) && strcmpi(metrics{1}, 'auto')
                    if any(strcmp({ver().Name}, 'MATLAB Test')) && license('test', 'MATLAB_Test')
                        if ~isMATLABReleaseOlderThan("R2023a")
                            metrics = {'mcdc'};
                        else
                            metrics = {'statement'};
                        end
                    else
                        metrics = {'statement'};
                    end
                end

                % Create a shared CoverageResult format object
                format = matlab.unittest.plugins.codecoverage.CoverageResult;

                % Create an array to hold multiple plugins
                plugins = matlab.unittest.plugins.TestRunnerPlugin.empty(0);

                % Get source folder from environment variable
                sourceFolder = getenv('MW_INPUT_SOURCE_FOLDER');
                if isempty(sourceFolder)
                    sourceFolder = pwd;
                end

                if isMATLABReleaseOlderThan("R2026b")
                    metric = metrics{1};
                    coveragePlugin = matlab.unittest.plugins.CodeCoveragePlugin.forFolder(...
                        sourceFolder, 'Producing', format, 'MetricLevel', metric);
                else
                    coveragePlugin = matlab.unittest.plugins.CodeCoveragePlugin.forFolder(...
                        sourceFolder, 'Producing', format, 'Metrics', metrics);
                end

                plugins(end+1) = coveragePlugin;

                % Add the summary plugin with the same format object
                summaryPlugin = testframework.CodeCoverageSummaryPlugin(format, metrics);
                plugins(end+1) = summaryPlugin;
            else
                plugins = matlab.unittest.plugins.TestRunnerPlugin.empty(1,0);
            end
        end
    end
end
)%

classdef CodeCoverageSummaryPluginService < matlab.buildtool.internal.services.ciplugins.CITestRunnerPluginService
    % Copyright 2026 The MathWorks, Inc.
    
    methods
        function plugins = providePlugins(~, ~)
            hasCoverageHTML = ~isempty(getenv('MW_INPUT_CODE_COVERAGE_HTML'));
            hasCoverageCobertura = ~isempty(getenv('MW_INPUT_CODE_COVERAGE_COBERTURA'));
            hasCoverageRequest = hasCoverageHTML || hasCoverageCobertura;
            metricLevel = getenv('MW_INPUT_CODE_COVERAGE_METRIC_LEVEL');

            % MATLAB Test product installation is only required for decision, condition, and mcdc levels
            requiresProductInstall = ismember(metricLevel, {'decision', 'condition', 'mcdc'});
            if requiresProductInstall
                verInfo = ver;
                productNames = string({verInfo.Name});
                isProductInstalled = any(productNames.matches('MATLAB Test'));
            else
                isProductInstalled = true;
            end

            if strcmpi(getenv("MW_INPUT_GENERATE_SUMMARY"), "true") && ~hasCoverageRequest && license('test', 'matlab_test') && isProductInstalled

                % Create a shared CoverageResult format object
                format = matlab.unittest.plugins.codecoverage.CoverageResult;
                
                % Create an array to hold multiple plugins
                plugins = matlab.unittest.plugins.TestRunnerPlugin.empty(0);
                
                % Get source folder from environment variable
                sourceFolder = getenv('MW_INPUT_SOURCE_FOLDER');
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

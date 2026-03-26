classdef CodeCoverageSummaryPlugin < matlab.unittest.plugins.TestRunnerPlugin
    % Copyright 2025 The MathWorks, Inc.
    
    properties (Access=private)
        CoverageFormat
        MetricLevel
    end
    
    methods
        function plugin = CodeCoverageSummaryPlugin(coverageFormat, metricLevel)
            plugin.CoverageFormat = coverageFormat;
            plugin.MetricLevel = metricLevel;
        end
    end
    
    methods (Access=protected)
        function runSession(plugin, pluginData)
            % Checkout MATLAB Test license
            license('checkout', 'matlab_test');
            
            % Run the session first (this ensures coverage data is collected)
            runSession@matlab.unittest.plugins.TestRunnerPlugin(plugin, pluginData);
            
            % Now extract and save coverage data
            if isempty(plugin.CoverageFormat.Result)
                warning("testframework:CodeCoverageSummaryPlugin:NoCoverageData", "No coverage data collected.");
                return;
            end
            
            result = plugin.CoverageFormat.Result;
            
            % Create coverage summary structure
            coverageDetails = struct();
            coverageDetails.MetricLevel = plugin.MetricLevel;
            
            % Always get statement and function coverage (available for all levels)
            statementCoverage = coverageSummary(result, "statement");
            functionCoverage = coverageSummary(result, "function");
            
            coverageDetails.StatementCoverage = sumCoverage(statementCoverage);
            coverageDetails.FunctionCoverage = sumCoverage(functionCoverage);
            
            % Get decision coverage if metric level is decision, condition, or mcdc
            if ismember(plugin.MetricLevel, {'decision', 'condition', 'mcdc'})
                decisionCoverage = coverageSummary(result, "decision");
                coverageDetails.DecisionCoverage = sumCoverage(decisionCoverage);
            end
            
            % Get condition coverage if metric level is condition or mcdc
            if ismember(plugin.MetricLevel, {'condition', 'mcdc'})
                conditionCoverage = coverageSummary(result, "condition");
                coverageDetails.ConditionCoverage = sumCoverage(conditionCoverage);
            end
            
            % Get MC/DC coverage if metric level is mcdc
            if strcmp(plugin.MetricLevel, 'mcdc')
                mcdcCoverage = coverageSummary(result, "mcdc");
                coverageDetails.MCDCCoverage = sumCoverage(mcdcCoverage);
            end
            
            % Determine file path for coverage results
            if ~isempty(getenv("RUNNER_TEMP")) && ~isempty(getenv("GITHUB_RUN_ID"))
                % GitHub Actions environment
                coverageArtifactFile = fullfile(getenv("RUNNER_TEMP"), "matlabCoverageResults" + getenv("GITHUB_RUN_ID") + ".json");
            else
                % Local environment
                coverageArtifactFile = fullfile(pwd, "matlabCoverageResults.json");
            end
            coverageResults = {coverageDetails};

            try
                JsonCoverageResults = jsonencode(coverageResults, "PrettyPrint", true);

                [fID, msg] = fopen(coverageArtifactFile, "w");
                if fID == -1
                    warning("testframework:CodeCoverageSummaryPlugin:UnableToOpenFile","Unable to open a file required to create the table of code coverage. (Cause: %s)", msg);
                else
                    closeFile = onCleanup(@()fclose(fID));
                    fprintf(fID, '%s', JsonCoverageResults);
                end
            catch e
                warning("testframework:TestResultsSummaryPlugin:UnableToJsonEncode","Unable to jsonencode test results data. (Cause: %s)", e.message);
            end
        end
    end
end

% Helper function to sum up the coverage data from multiple files
function coverageStruct = sumCoverage(coverageMatrix)
    % Split the vector in half: first half is executed, second half is total
    executed = sum(coverageMatrix(:, 1));
    total = sum(coverageMatrix(:, 2));
    
    coverageStruct = struct(...
        'Executed', executed, ...
        'Total', total, ...
        'Percentage', calculatePercentage([executed, total]) ...
    );
end

% function to calculate percentage
function percentage = calculatePercentage(coverageData)
    if coverageData(2) == 0
        percentage = NaN; % Avoid division by zero
    else
        percentage = (coverageData(1) / coverageData(2)) * 100;
    end
end

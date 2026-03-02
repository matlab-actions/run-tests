classdef CodeCoverageSummaryPlugin < matlab.unittest.plugins.TestRunnerPlugin
    % Copyright 2025 The MathWorks, Inc.
    
    properties (Access=private)
        CoverageFormat
        MetricLevel
    end
    
    methods
        function plugin = CodeCoverageSummaryPlugin(coverageFormat, metricLevel)
            plugin.CoverageFormat = coverageFormat;
            if nargin < 2
                plugin.MetricLevel = 'mcdc';
            else
                plugin.MetricLevel = lower(metricLevel);
            end
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
                warning('CodeCoverageSummaryPlugin:NoCoverageData', ...
                    'No coverage data collected. Ensure CodeCoveragePlugin is added with the same format object.');
                return;
            end
            
            result = plugin.CoverageFormat.Result;
            
            % Create coverage summary structure
            coverageDetails = struct();
            coverageDetails.MetricLevel = plugin.MetricLevel;
            
            % Always get statement and function coverage (available for all levels)
            statementCoverage = coverageSummary(result, "statement");
            functionCoverage = coverageSummary(result, "function");
            
            coverageDetails.StatementCoverage = aggregateCoverage(statementCoverage);
            coverageDetails.FunctionCoverage = aggregateCoverage(functionCoverage);
            
            % Get decision coverage if metric level is decision, condition, or mcdc
            if ismember(plugin.MetricLevel, {'decision', 'condition', 'mcdc'})
                decisionCoverage = coverageSummary(result, "decision");
                coverageDetails.DecisionCoverage = aggregateCoverage(decisionCoverage);
            end
            
            % Get condition coverage if metric level is condition or mcdc
            if ismember(plugin.MetricLevel, {'condition', 'mcdc'})
                conditionCoverage = coverageSummary(result, "condition");
                coverageDetails.ConditionCoverage = aggregateCoverage(conditionCoverage);
            end
            
            % Get MC/DC coverage if metric level is mcdc
            if strcmp(plugin.MetricLevel, 'mcdc')
                mcdcCoverage = coverageSummary(result, "mcdc");
                coverageDetails.MCDCCoverage = aggregateCoverage(mcdcCoverage);
            end
            
            % Determine file path for coverage results
            if ~isempty(getenv("RUNNER_TEMP")) && ~isempty(getenv("GITHUB_RUN_ID"))
                % GitHub Actions environment
                coverageArtifactFile = fullfile(getenv("RUNNER_TEMP"), "matlabCoverageResults" + getenv("GITHUB_RUN_ID") + ".json");
            else
                % Local environment
                coverageArtifactFile = fullfile(pwd, "matlabCoverageResults.json");
            end
            
            % If coverage results artifact exists, update the same file
            %if isfile(coverageArtifactFile)
            %     coverageResults = {jsondecode(fileread(coverageArtifactFile))};
            % else
            %     coverageResults = {};
            % end
            % coverageResults{end+1} = coverageDetails;
            coverageResults = {coverageDetails};
            
            JsonCoverageResults = jsonencode(coverageResults, "PrettyPrint", true);
            [fID, msg] = fopen(coverageArtifactFile, "w");
            if fID == -1
                warning("codecoverage:CodeCoverageSummaryPlugin:UnableToOpenFile",...
                    "Could not open a file for GitHub coverage result table due to: %s", msg);
            else
                closeFile = onCleanup(@()fclose(fID));
                fprintf(fID, '%s', JsonCoverageResults);
                disp("Coverage data written to: " + coverageArtifactFile);
            end
        end
    end
end

% Helper function to aggregate coverage data from multiple files
function coverageStruct = aggregateCoverage(coverageMatrix)
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

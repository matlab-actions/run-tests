classdef CodeCoverageSummaryPlugin < matlab.unittest.plugins.TestRunnerPlugin
    % Copyright 2026 The MathWorks, Inc.
    
    properties (Access=private)
        CoverageFormat
        Metrics
    end
    
    methods
        function plugin = CodeCoverageSummaryPlugin(coverageFormat, metrics)
            plugin.CoverageFormat = coverageFormat;
            plugin.Metrics = metrics;
        end
    end
    
    methods (Access=protected)
        function runSession(plugin, pluginData)
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

            % Always get function and statement coverage
            functionCoverage = coverageSummary(result, "function");
            statementCoverage = coverageSummary(result, "statement");

            coverageDetails.FunctionCoverage = sumCoverage(functionCoverage);
            coverageDetails.StatementCoverage = sumCoverage(statementCoverage);

            % Get decision coverage if metrics contains decision, condition, or mcdc
            if any(ismember({'decision', 'condition', 'mcdc'}, plugin.Metrics))
                decisionCoverage = coverageSummary(result, "decision");
                coverageDetails.DecisionCoverage = sumCoverage(decisionCoverage);
            end

            % Get condition coverage if metrics contains condition or mcdc
            if any(ismember({'condition', 'mcdc'}, plugin.Metrics))
                conditionCoverage = coverageSummary(result, "condition");
                coverageDetails.ConditionCoverage = sumCoverage(conditionCoverage);
            end

            % Get MC/DC coverage if metrics contains mcdc
            if any(ismember({'mcdc'}, plugin.Metrics))
                mcdcCoverage = coverageSummary(result, "mcdc");
                coverageDetails.MCDCCoverage = sumCoverage(mcdcCoverage);
            end
            
            coverageResults = {coverageDetails};
            
            % Determine file path for coverage results
            coverageArtifactFile = fullfile(getenv("RUNNER_TEMP"), "matlabCoverageResults" + getenv("GITHUB_RUN_ID") + ".json");

            try
                JsonCoverageResults = jsonencode(coverageResults, "PrettyPrint", true);

                [fID, msg] = fopen(coverageArtifactFile, "w");
                if fID == -1
                    warning("testframework:CodeCoverageSummaryPlugin:UnableToOpenFile","Unable to open a file required to show code coverage data. (Cause: %s)", msg);
                else
                    closeFile = onCleanup(@()fclose(fID));
                    fprintf(fID, '%s', JsonCoverageResults);
                end
            catch e
                warning("testframework:CodeCoverageSummaryPlugin:UnableToJsonEncode","Unable to serialize code coverage data into JSON format. (Cause: %s)", e.message);
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

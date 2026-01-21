classdef CodeCoverageSummaryPlugin < matlab.unittest.plugins.TestRunnerPlugin
    % Copyright 2025 The MathWorks, Inc.
    
    properties (Access=private)
        CoverageFormat
    end
    
    methods
        function plugin = CodeCoverageSummaryPlugin(coverageFormat)
            % Constructor: accepts CoverageResult format object
            plugin.CoverageFormat = coverageFormat;
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
            %disp("result is ");
            %disp(result);
            % Get coverage summaries for all metrics
            %[statementCoverage, statementDetails] = coverageSummary(result, "statement");
            statementCoverage = coverageSummary(result, "statement");
            functionCoverage = coverageSummary(result, "function");
            decisionCoverage = coverageSummary(result, "decision");
            conditionCoverage = coverageSummary(result, "condition");
            mcdcCoverage = coverageSummary(result, "mcdc");
            
            % Create coverage summary structure
            coverageDetails = struct();
            %disp("statement coverage");
            %disp(statementCoverage);
            coverageDetails.StatementCoverage = aggregateCoverage(statementCoverage);
            coverageDetails.FunctionCoverage = aggregateCoverage(functionCoverage);
            coverageDetails.DecisionCoverage = aggregateCoverage(decisionCoverage);
            coverageDetails.ConditionCoverage = aggregateCoverage(conditionCoverage);
            coverageDetails.MCDCCoverage = aggregateCoverage(mcdcCoverage);


            % % Add all coverage metrics
            % coverageDetails.StatementCoverage = struct(...
            %     'Executed', statementExec, ...
            %     'Total', statementTotal, ...
            %     'Percentage', calculatePercentage(statementCoverage) ...
            % );
            % 
            % coverageDetails.FunctionCoverage = struct(...
            %     'Executed', functionCoverage(1), ...
            %     'Total', functionCoverage(2), ...
            %     'Percentage', calculatePercentage(functionCoverage) ...
            % );
            % 
            % coverageDetails.DecisionCoverage = struct(...
            %     'Executed', decisionCoverage(1), ...
            %     'Total', decisionCoverage(2), ...
            %     'Percentage', calculatePercentage(decisionCoverage) ...
            % );
            % 
            % coverageDetails.ConditionCoverage = struct(...
            %     'Executed', conditionCoverage(1), ...
            %     'Total', conditionCoverage(2), ...
            %     'Percentage', calculatePercentage(conditionCoverage) ...
            % );
            % 
            % coverageDetails.MCDCCoverage = struct(...
            %     'Executed', mcdcCoverage(1), ...
            %     'Total', mcdcCoverage(2), ...
            %     'Percentage', calculatePercentage(mcdcCoverage) ...
            % );
            
            % % Add detailed information
            % if ~isempty(functionDetails) && isfield(functionDetails, 'function')
            %     coverageDetails.FunctionDetails = functionDetails.function;
            % end
            % 
            % if ~isempty(statementDetails) && isfield(statementDetails, 'statement')
            %     coverageDetails.StatementDetails = statementDetails.statement;
            % end
            % 
            % if ~isempty(decisionDetails) && isfield(decisionDetails, 'decision')
            %     coverageDetails.DecisionDetails = decisionDetails.decision;
            % end
            % 
            % if ~isempty(conditionDetails) && isfield(conditionDetails, 'condition')
            %     coverageDetails.ConditionDetails = conditionDetails.condition;
            % end
            % 
            % if ~isempty(mcdcDetails) && isfield(mcdcDetails, 'mcdc')
            %     coverageDetails.MCDCDetails = mcdcDetails.mcdc;
            % end
            
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

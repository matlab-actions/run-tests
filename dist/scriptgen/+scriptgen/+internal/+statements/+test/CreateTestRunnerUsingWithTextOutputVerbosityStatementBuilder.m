classdef CreateTestRunnerUsingWithTextOutputVerbosityStatementBuilder < scriptgen.statements.test.CreateTestRunnerStatementBuilder ...
        & scriptgen.internal.mixin.VersionDependent
    % Copyright 2020-2022 The MathWorks, Inc.
    
    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2014b')
    end
    
    methods
        function statement = build(obj)
            import scriptgen.Statement;
            import scriptgen.internal.numericVerbosity;
            
            imports = {'matlab.unittest.TestRunner'};
            
            if ~isempty(obj.LoggingLevel) && ~isempty(obj.OutputDetail)
                verbosity = max(numericVerbosity(obj.LoggingLevel), numericVerbosity(obj.OutputDetail));
            elseif ~isempty(obj.LoggingLevel)
                verbosity = numericVerbosity(obj.LoggingLevel);
            elseif ~isempty(obj.OutputDetail)
                verbosity = numericVerbosity(obj.OutputDetail);
            else
                verbosity = [];
            end
            
            nvpairs = {};
            if ~isempty(verbosity)
                nvpairs{end+1} = sprintf('''Verbosity'', %s', num2str(verbosity));
            end
            
            text = sprintf('%s = TestRunner.withTextOutput(%s);', obj.RunnerName, strjoin(nvpairs,', '));

            if ~isempty(obj.LoggingLevel) && ~isempty(obj.OutputDetail)
                text = [text ' % Unable to specify the logging level and output detail independently in this release of MATLAB.'];
            end
            
            statement = Statement(text, imports);
        end
    end
end


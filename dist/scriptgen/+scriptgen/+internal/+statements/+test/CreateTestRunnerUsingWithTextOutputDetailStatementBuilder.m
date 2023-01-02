classdef CreateTestRunnerUsingWithTextOutputDetailStatementBuilder < scriptgen.statements.test.CreateTestRunnerStatementBuilder ...
        & scriptgen.internal.mixin.VersionDependent
    % Copyright 2020-2022 The MathWorks, Inc.
    
    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2018b')
    end
    
    methods
        function statement = build(obj)
            import scriptgen.Statement;
            import scriptgen.internal.numericVerbosity;
            
            imports = {'matlab.unittest.TestRunner'};
            
            nvpairs = {};
            if ~isempty(obj.LoggingLevel)
                nvpairs{end+1} = sprintf('''LoggingLevel'', %s', num2str(numericVerbosity(obj.LoggingLevel)));
            end
            if ~isempty(obj.OutputDetail)
                nvpairs{end+1} = sprintf('''OutputDetail'', %s', num2str(numericVerbosity(obj.OutputDetail)));
            end
            
            text = sprintf('%s = TestRunner.withTextOutput(%s);', obj.RunnerName, strjoin(nvpairs,', '));
            
            statement = Statement(text, imports);
        end
    end
end


classdef CreateTestRunnerStatementBuilder < scriptgen.CodeBuilder
    % Copyright 2020-2022 The MathWorks, Inc.
    
    properties
        RunnerName = 'runner'
        LoggingLevel = 'terse'
        OutputDetail = 'concise'
    end
    
    methods
        function set.RunnerName(obj, value)
            scriptgen.internal.validateTextScalar(value);
            obj.RunnerName = value;
        end
        
        function set.LoggingLevel(obj, value)
            scriptgen.internal.validateVerbosityScalar(value);
            obj.LoggingLevel = value;
        end
        
        function set.OutputDetail(obj, value)
            scriptgen.internal.validateVerbosityScalar(value);
            obj.OutputDetail = value;
        end
    end
end


classdef CreateTestSuiteStatementBuilder < scriptgen.CodeBuilder
    % Copyright 2020 The MathWorks, Inc.
    
    properties
        SuiteName = 'suite'
    end
    
    methods
        function set.SuiteName(obj, value)
            scriptgen.internal.validateTextScalar(value);
            obj.SuiteName = value;
        end
    end
end


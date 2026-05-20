classdef AssertNoFailuresSequenceBuilder < scriptgen.CodeBuilder
    % Copyright 2020 The MathWorks, Inc.
    
    properties
        CodeProvider = scriptgen.CodeProvider.default()
        ResultsName = 'results'
    end
    
    methods
        function set.CodeProvider(obj, value)
            validateattributes(value, {'scriptgen.CodeProvider'}, {'scalar'});
            obj.CodeProvider = value;
        end
        
        function set.ResultsName(obj, value)
            scriptgen.internal.validateTextScalar(value);
            obj.ResultsName = value;
        end
    end
end
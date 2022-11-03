classdef CreateTAPPluginExpressionBuilder < scriptgen.CodeBuilder
    % Copyright 2020 The MathWorks, Inc.
    
    properties
        FilePath = '''results.tap'''
    end
    
    methods
        function set.FilePath(obj, value)
            scriptgen.internal.validateTextScalar(value);
            obj.FilePath = value;
        end
    end
end


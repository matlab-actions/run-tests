classdef CreateCoberturaModelPluginExpressionBuilder < scriptgen.CodeBuilder
    % Copyright 2020 The MathWorks, Inc.
    
    properties
        FilePath = '''coverage.xml'''
    end
    
    methods
        function set.FilePath(obj, value)
            scriptgen.internal.validateTextScalar(value);
            obj.FilePath = value;
        end
    end
end


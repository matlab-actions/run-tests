classdef CreateHasTagSelectorExpressionBuilder < scriptgen.CodeBuilder
    % Copyright 2020 The MathWorks, Inc.
    
    properties
        Tag = '''tag'''
    end
    
    methods
        function set.Tag(obj, value)
            scriptgen.internal.validateTextScalar(value);
            obj.Tag = value;
        end
    end
end


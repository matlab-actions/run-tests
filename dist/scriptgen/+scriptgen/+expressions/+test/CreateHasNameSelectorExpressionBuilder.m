classdef CreateHasNameSelectorExpressionBuilder < scriptgen.CodeBuilder
    % Copyright 2024 The MathWorks, Inc.
    
    properties
        SelectByName = {}
    end
    
    methods
        function set.SelectByName(obj, value)
            scriptgen.internal.validateTextArray(value);
            obj.SelectByName = value;
        end
    end
end

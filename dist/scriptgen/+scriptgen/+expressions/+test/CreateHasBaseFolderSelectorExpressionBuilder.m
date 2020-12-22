classdef CreateHasBaseFolderSelectorExpressionBuilder < scriptgen.CodeBuilder
    % Copyright 2020 The MathWorks, Inc.
    
    properties
        BaseFolder = {'pwd'}
    end
    
    methods
        function set.BaseFolder(obj, value)
            scriptgen.internal.validateTextArray(value);
            obj.BaseFolder = value;
        end
    end
end
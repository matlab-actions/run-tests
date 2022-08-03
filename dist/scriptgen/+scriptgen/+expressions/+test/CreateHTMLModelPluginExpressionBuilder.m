classdef CreateHTMLModelPluginExpressionBuilder < scriptgen.CodeBuilder
    % Copyright 2021 The MathWorks, Inc.

    properties
        FolderPath = '''htmlModelCoverage'''
    end

    methods
         function set.FolderPath(obj, value)
             scriptgen.internal.validateTextScalar(value);
             obj.FolderPath = value;
         end
    end
end
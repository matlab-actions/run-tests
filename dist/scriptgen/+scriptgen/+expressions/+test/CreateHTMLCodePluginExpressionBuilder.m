classdef CreateHTMLCodePluginExpressionBuilder < scriptgen.CodeBuilder
    % Copyright 2020 The MathWorks, Inc.
    
    properties
        FolderPath = '''html'''
        Source = {'pwd'}
    end
    
    methods
        function set.FolderPath(obj, value)
            scriptgen.internal.validateTextScalar(value);
            obj.FolderPath = value;
        end
        
        function set.Source(obj, value)
            scriptgen.internal.validateTextArray(value);
            obj.Source = value;
        end
    end
end
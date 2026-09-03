classdef CreateHTMLCodePluginExpressionBuilder < scriptgen.CodeBuilder
    % Copyright 2020-2026 The MathWorks, Inc.
    
    properties
        FolderPath = '''htmlCodeCoverage'''
        Source = {'pwd'}
        Metrics = {}
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

        function set.Metrics(obj, value)
            scriptgen.internal.validateTextArray(value);
            obj.Metrics = value;
        end
    end
end
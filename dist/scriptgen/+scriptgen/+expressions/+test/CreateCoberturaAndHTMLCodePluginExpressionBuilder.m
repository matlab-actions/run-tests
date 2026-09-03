classdef CreateCoberturaAndHTMLCodePluginExpressionBuilder < scriptgen.CodeBuilder
    % Copyright 2022-2026 The MathWorks, Inc.
    
    properties
        CoberturaFilePath = '''coverage.xml'''
        HTMLFolderPath = '''htmlCodeCoverage'''
        Source = {'pwd'}
        Metrics = {}
    end

    methods
        function set.CoberturaFilePath(obj, value)
            scriptgen.internal.validateTextScalar(value);
            obj.CoberturaFilePath = value;
        end

        function set.HTMLFolderPath(obj, value)
            scriptgen.internal.validateTextScalar(value);
            obj.HTMLFolderPath = value;
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


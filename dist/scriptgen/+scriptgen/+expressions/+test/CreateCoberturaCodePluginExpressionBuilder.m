classdef CreateCoberturaCodePluginExpressionBuilder < scriptgen.CodeBuilder
    % Copyright 2020-2026 The MathWorks, Inc.
    
    properties
        FilePath = '''coverage.xml'''
        Source = {'pwd'}
        Metrics = {}
    end

    methods
        function set.FilePath(obj, value)
            scriptgen.internal.validateTextScalar(value);
            obj.FilePath = value;
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


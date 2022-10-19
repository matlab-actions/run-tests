classdef CreateCoberturaAndHTMLCodePluginExpressionBuilder < scriptgen.CodeBuilder
    % Copyright 2022 The MathWorks, Inc.
    
    properties
        CoberturaFilePath = '''coverage.xml'''
        HTMLFolderPath = '''htmlCodeCoverage'''
        Source = {'pwd'}
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
    end
end


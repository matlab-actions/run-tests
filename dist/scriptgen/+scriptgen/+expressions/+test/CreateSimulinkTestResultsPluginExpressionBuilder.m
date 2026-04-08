classdef CreateSimulinkTestResultsPluginExpressionBuilder < scriptgen.CodeBuilder
    % Copyright 2020 The MathWorks, Inc.
    
    properties
        FilePath = '''results.mldatx'''
    end
    
    methods
        function set.FilePath(obj, value)
            scriptgen.internal.validateTextScalar(value);
            obj.FilePath = value;
        end
    end
end


classdef CreatePDFPluginWithMacExpressionBuilder < scriptgen.expressions.test.CreatePDFPluginExpressionBuilder ...
        & scriptgen.internal.mixin.VersionDependent 
    % Copyright 2021 The MathWorks, Inc.
    
    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2020b')
    end
    
    methods
        function expression = build(obj)
            import scriptgen.Expression;
            
            imports = {'matlab.unittest.plugins.TestReportPlugin'};
            
            text = sprintf('TestReportPlugin.producingPDF(%s)', obj.FilePath);
            
            expression = Expression(text, imports);
        end
    end
end


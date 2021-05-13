classdef CreateCoberturaModelPluginExpressionBuilder < scriptgen.expressions.test.CreateCoberturaModelPluginExpressionBuilder ...
        & scriptgen.internal.mixin.VersionDependent ...
        & scriptgen.internal.mixin.PathDependent
    % Copyright 2020 The MathWorks, Inc.
    
    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2018b')
        RequiredPathNames = {'sltest.plugins.ModelCoveragePlugin'}
    end
    
    methods        
        function expression = build(obj)
            import scriptgen.Expression;
            
            imports = { ...
                'matlab.unittest.plugins.codecoverage.CoberturaFormat', ...
                'sltest.plugins.ModelCoveragePlugin'};
            
            text = sprintf('ModelCoveragePlugin(''Producing'', CoberturaFormat(%s))', obj.FilePath);
            
            expression = Expression(text, imports);
        end
    end
end


classdef CreateCoberturaCodePluginSerialExpressionBuilder < scriptgen.expressions.test.CreateCoberturaCodePluginSerialExpressionBuilder ...
        & scriptgen.internal.mixin.VersionDependent
    % Copyright 2020-2022 The MathWorks, Inc.
    
    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2017b')
    end
    
    methods
        function expression = build(obj)
            import scriptgen.Expression;
            
            imports = { ...
                'matlab.unittest.plugins.codecoverage.CoberturaFormat', ...
                'matlab.unittest.plugins.CodeCoveragePlugin'};
            
            source = strjoin(obj.Source, ', ');
            text = sprintf('CodeCoveragePlugin.forFolder({%s}, ''IncludingSubfolders'', true, ''Producing'', CoberturaFormat(%s))', source, obj.FilePath);
            
            expression = Expression(text, imports);
        end
    end
end


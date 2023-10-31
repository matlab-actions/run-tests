classdef CreateHTMLCodePluginSerialExpressionBuilder < scriptgen.expressions.test.CreateHTMLCodePluginSerialExpressionBuilder ...
        & scriptgen.internal.mixin.VersionDependent
    % Copyright 2020-2022 The MathWorks, Inc.
    
    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2019a')
    end
    
    methods
        function expression = build(obj)
            import scriptgen.Expression;
            
            imports = { ...
                'matlab.unittest.plugins.codecoverage.CoverageReport', ...
                'matlab.unittest.plugins.CodeCoveragePlugin'};
            
            source = strjoin(obj.Source, ', ');
            text = sprintf('CodeCoveragePlugin.forFolder({%s}, ''IncludingSubfolders'', true, ''Producing'', CoverageReport(%s))', source, obj.FolderPath);
            
            expression = Expression(text, imports);
        end
    end
end


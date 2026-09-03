classdef CreateHTMLCodePluginMetricLvlSerialExpressionBuilder < scriptgen.expressions.test.CreateHTMLCodePluginSerialExpressionBuilder ...
        & scriptgen.internal.mixin.VersionDependent
    % Copyright 2026 The MathWorks, Inc.
    
    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2023a')
    end
    
    methods
        function expression = build(obj)
            import scriptgen.Expression;

            imports = { ...
                'matlab.unittest.plugins.codecoverage.CoverageReport', ...
                'matlab.unittest.plugins.CodeCoveragePlugin'};

            source = strjoin(obj.Source, ', ');
            if isempty(obj.Metrics)
                text = sprintf('CodeCoveragePlugin.forFolder({%s}, ''IncludingSubfolders'', true, ''Producing'', CoverageReport(%s))', source, obj.FolderPath);
            else
                metrics = obj.Metrics{1};
                text = sprintf('CodeCoveragePlugin.forFolder({%s}, ''IncludingSubfolders'', true, ''MetricLevel'', %s, ''Producing'', CoverageReport(%s))', source, metrics, obj.FolderPath);
            end

            expression = Expression(text, imports);
        end
    end
end


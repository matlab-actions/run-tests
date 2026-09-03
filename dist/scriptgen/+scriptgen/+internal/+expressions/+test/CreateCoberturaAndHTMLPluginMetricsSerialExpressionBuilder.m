classdef CreateCoberturaAndHTMLPluginMetricsSerialExpressionBuilder < scriptgen.expressions.test.CreateCoberturaAndHTMLCodePluginSerialExpressionBuilder ...
        & scriptgen.internal.mixin.VersionDependent
    % Copyright 2026 The MathWorks, Inc.

    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2026b')
    end

    methods
        function expression = build(obj)
            import scriptgen.Expression;

            imports = { ...
                'matlab.unittest.plugins.codecoverage.CoberturaFormat', ...
                'matlab.unittest.plugins.codecoverage.CoverageReport', ...
                'matlab.unittest.plugins.CodeCoveragePlugin'};

            source = strjoin(obj.Source, ', ');
            if isempty(obj.Metrics)
                text = sprintf('CodeCoveragePlugin.forFolder({%s}, ''IncludingSubfolders'', true, ''Producing'', [CoberturaFormat(%s) CoverageReport(%s)])', source, obj.CoberturaFilePath, obj.HTMLFolderPath);
            else
                metrics = strjoin(obj.Metrics, ', ');
                text = sprintf('CodeCoveragePlugin.forFolder({%s}, ''IncludingSubfolders'', true, ''Metrics'', {%s}, ''Producing'', [CoberturaFormat(%s) CoverageReport(%s)])', source, metrics, obj.CoberturaFilePath, obj.HTMLFolderPath);
            end

            expression = Expression(text, imports);
        end
    end
end

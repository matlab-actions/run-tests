classdef CreateHTMLTestReportPluginExpressionBuilder < scriptgen.expressions.test.CreateHTMLTestReportPluginExpressionBuilder ...
        & scriptgen.internal.mixin.VersionDependent
    % Copyright 2021 The MathWorks, Inc.

    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2017b')
    end

    methods
        function expression = build(obj)
            import scriptgen.Expression;

            imports = {'matlab.unittest.plugins.TestReportPlugin'};

            text = sprintf('TestReportPlugin.producingHTML(%s)', obj.FolderPath);

            expression = Expression(text, imports);
        end
    end
end
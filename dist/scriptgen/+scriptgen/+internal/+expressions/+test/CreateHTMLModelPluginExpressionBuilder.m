classdef CreateHTMLModelPluginExpressionBuilder < scriptgen.expressions.test.CreateHTMLModelPluginExpressionBuilder ...
        & scriptgen.internal.mixin.VersionDependent ...
        & scriptgen.internal.mixin.PathDependent
    % Copyright 2021 The MathWorks, Inc.

    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2018a')
        RequiredPathNames = {'sltest.plugins.ModelCoveragePlugin'}
    end

    methods
        function expression = build(obj)
            import scriptgen.Expression;
            import scriptgen.internal.unquoteText;
            import scriptgen.internal.isAbsolutePath;

            imports = { ...
                'sltest.plugins.coverage.ModelCoverageReport', ...
                'sltest.plugins.ModelCoveragePlugin'};

            % ModelCoverage report does not handle relative paths
            if ~strcmp(obj.FolderPath, unquoteText(obj.FolderPath)) && ~isAbsolutePath(unquoteText(obj.FolderPath))
                folderPath = ['fullfile(pwd, ' obj.FolderPath ')'];
            else
                folderPath = obj.FolderPath;
            end

            text = sprintf('ModelCoveragePlugin(''Producing'', ModelCoverageReport(%s))', folderPath);

            expression = Expression(text, imports);
        end
    end
end


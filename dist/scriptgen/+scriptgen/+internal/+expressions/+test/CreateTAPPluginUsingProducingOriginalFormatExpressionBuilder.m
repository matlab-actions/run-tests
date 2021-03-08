classdef CreateTAPPluginUsingProducingOriginalFormatExpressionBuilder < scriptgen.expressions.test.CreateTAPPluginExpressionBuilder ...
        & scriptgen.internal.mixin.VersionDependent
    % Copyright 2020 The MathWorks, Inc.
    
    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2014a')
    end
    
    methods
        function expression = build(obj)
            import scriptgen.Expression;
            import scriptgen.internal.unquoteText;
            import scriptgen.internal.isAbsolutePath;
            
            imports = { ...
                'matlab.unittest.plugins.ToFile', ...
                'matlab.unittest.plugins.TAPPlugin'};
            
            % Fixes an issue where ToFile did not properly resolve
            % fullpaths prior to R2015a.
            if ~strcmp(obj.FilePath, unquoteText(obj.FilePath)) && ~isAbsolutePath(unquoteText(obj.FilePath))
                filePath = ['fullfile(pwd, ' obj.FilePath ')'];
            else
                filePath = obj.FilePath;
            end
            
            text = sprintf('TAPPlugin.producingOriginalFormat(ToFile(%s))', filePath);
            
            expression = Expression(text, imports);
        end
    end
end
classdef CreateTAPPluginUsingVersion13ParallelExpressionBuilder < scriptgen.expressions.test.CreateTAPPluginParallelExpressionBuilder ...
        & scriptgen.internal.mixin.VersionDependent
    % Copyright 2022 The MathWorks, Inc.
    
    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2018a')
    end
    
    methods
        function expression = build(obj)
            import scriptgen.Expression;
            
            imports = { ...
                'matlab.unittest.plugins.ToUniqueFile', ...
                'matlab.unittest.plugins.TAPPlugin'};
            
            filePath = scriptgen.internal.unquoteText(obj.FilePath);
            hadQuotes = ~strcmp(filePath, obj.FilePath);
            if hadQuotes
                [fp,name,ext] = fileparts(filePath);
                filePath = ['''' fullfile(fp, name) ''''];
            else
                ext = '.tap';
            end
            
            text = sprintf('TAPPlugin.producingVersion13(ToUniqueFile(%s, ''WithExtension'', ''%s''))', filePath, ext);
            
            expression = Expression(text, imports);
        end
    end
end


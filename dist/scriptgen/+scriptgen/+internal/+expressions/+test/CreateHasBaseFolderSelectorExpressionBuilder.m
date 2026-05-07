classdef CreateHasBaseFolderSelectorExpressionBuilder < scriptgen.expressions.test.CreateHasBaseFolderSelectorExpressionBuilder ...
        & scriptgen.internal.mixin.VersionDependent
    % Copyright 2020 The MathWorks, Inc.
    
    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2014a')
    end
    
    methods 
        function expression = build(obj)
            import scriptgen.internal.unquoteText;
            import scriptgen.internal.isAbsolutePath;
            import scriptgen.Expression;
            
            imports = { ...
                'matlab.unittest.selectors.HasBaseFolder', ...
                'matlab.unittest.constraints.StartsWithSubstring'};
            
            constraints = {};
            for i = 1:numel(obj.BaseFolder)
                folder = obj.BaseFolder{i};
                if ~strcmp(folder, unquoteText(folder)) && ~isAbsolutePath(unquoteText(folder))
                    text = sprintf('StartsWithSubstring(fullfile(pwd, %s))', folder);
                else
                    text = sprintf('StartsWithSubstring(%s)', folder);
                end
                constraints{end+1} = text; %#ok<AGROW>
            end
            
            text = sprintf('HasBaseFolder(%s)', strjoin(constraints, ' | '));
            
            expression = Expression(text, imports);
        end
    end
end


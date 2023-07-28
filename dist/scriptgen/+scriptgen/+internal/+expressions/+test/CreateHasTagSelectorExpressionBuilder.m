classdef CreateHasTagSelectorExpressionBuilder < scriptgen.expressions.test.CreateHasTagSelectorExpressionBuilder ...
        & scriptgen.internal.mixin.VersionDependent
    % Copyright 2020 The MathWorks, Inc.
    
    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2015a')
    end
    
    methods
        function expression = build(obj)
            import scriptgen.Expression;
            
            imports = {'matlab.unittest.selectors.HasTag'};
            
            text = sprintf('HasTag(%s)', obj.Tag);
            
            expression = Expression(text, imports);
        end
    end
end




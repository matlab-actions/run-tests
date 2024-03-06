classdef CreateJUnitPluginSerialExpressionBuilder < scriptgen.expressions.test.CreateJUnitPluginSerialExpressionBuilder ...
        & scriptgen.internal.mixin.VersionDependent
    % Copyright 2020-2022 The MathWorks, Inc.
    
    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2015b')
    end
    
    methods
        function expression = build(obj)
            import scriptgen.Expression;
            
            imports = {'matlab.unittest.plugins.XMLPlugin'};
            
            text = sprintf('XMLPlugin.producingJUnitFormat(%s)', obj.FilePath);
            
            expression = Expression(text, imports);
        end
    end
end


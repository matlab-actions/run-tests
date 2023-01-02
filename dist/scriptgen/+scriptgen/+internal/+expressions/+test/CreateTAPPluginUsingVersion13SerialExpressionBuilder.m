classdef CreateTAPPluginUsingVersion13SerialExpressionBuilder < scriptgen.expressions.test.CreateTAPPluginSerialExpressionBuilder ...
        & scriptgen.internal.mixin.VersionDependent
    % Copyright 2020-2022 The MathWorks, Inc.
    
    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2016b')
    end
    
    methods
        function expression = build(obj)
            import scriptgen.Expression;
            
            imports = { ...
                'matlab.unittest.plugins.ToFile', ...
                'matlab.unittest.plugins.TAPPlugin'};
            
            text = sprintf('TAPPlugin.producingVersion13(ToFile(%s))', obj.FilePath);
            
            expression = Expression(text, imports);
        end
    end
end


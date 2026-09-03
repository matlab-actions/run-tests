classdef CreateFailOnWarningsPluginSerialExpressionBuilder < scriptgen.expressions.test.CreateFailOnWarningsPluginSerialExpressionBuilder ...
        & scriptgen.internal.mixin.VersionDependent
    % Copyright 2022 The MathWorks, Inc.
    
    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2015b')
    end
    
    methods
        function expression = build(~)
            import scriptgen.Expression;
            
            imports = {'matlab.unittest.plugins.FailOnWarningsPlugin'};
            
            text = 'FailOnWarningsPlugin()';
            
            expression = Expression(text, imports);
        end
    end
end


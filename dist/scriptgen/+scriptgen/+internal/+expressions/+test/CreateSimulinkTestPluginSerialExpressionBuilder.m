classdef CreateSimulinkTestPluginSerialExpressionBuilder < scriptgen.expressions.test.CreateSimulinkTestPluginSerialExpressionBuilder ...
        & scriptgen.internal.mixin.VersionDependent ...
        & scriptgen.internal.mixin.PathDependent
    % Copyright 2020-2022 The MathWorks, Inc.

    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2018b')
        RequiredPathNames = {'sltest.plugins.TestManagerResultsPlugin'}
    end
    
    methods
        function expression = build(~)
            import scriptgen.Expression;
            
            imports = {'sltest.plugins.TestManagerResultsPlugin'};
            
            text = sprintf('TestManagerResultsPlugin()');
            
            expression = Expression(text, imports);
        end
    end
end


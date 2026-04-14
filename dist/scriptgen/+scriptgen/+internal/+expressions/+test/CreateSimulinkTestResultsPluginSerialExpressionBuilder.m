classdef CreateSimulinkTestResultsPluginSerialExpressionBuilder < scriptgen.expressions.test.CreateSimulinkTestResultsPluginSerialExpressionBuilder ...
        & scriptgen.internal.mixin.VersionDependent ...
        & scriptgen.internal.mixin.PathDependent
    % Copyright 2020-2022 The MathWorks, Inc.

    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2019a')
        RequiredPathNames = {'sltest.plugins.TestManagerResultsPlugin'}
    end
    
    methods
        function expression = build(obj)
            import scriptgen.Expression;
            
            imports = {'sltest.plugins.TestManagerResultsPlugin'};
            
            text = sprintf('TestManagerResultsPlugin(''ExportToFile'', %s)', obj.FilePath);
            
            expression = Expression(text, imports);
        end
    end
end


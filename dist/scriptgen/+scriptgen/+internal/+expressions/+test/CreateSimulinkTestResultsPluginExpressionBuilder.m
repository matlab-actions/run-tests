classdef CreateSimulinkTestResultsPluginExpressionBuilder < scriptgen.expressions.test.CreateSimulinkTestResultsPluginExpressionBuilder ...
        & scriptgen.internal.mixin.VersionDependent ...
        & scriptgen.internal.mixin.PathDependent
    % Copyright 2020 The MathWorks, Inc.

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


classdef CreateSimulinkTestResultsPluginParallelExpressionBuilder < scriptgen.expressions.test.CreateSimulinkTestResultsPluginParallelExpressionBuilder ...
        & scriptgen.internal.mixin.VersionDependent ...
        & scriptgen.internal.mixin.PathDependent
    % Copyright 2022 The MathWorks, Inc.

    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2019a')
        RequiredPathNames = {'sltest.plugins.TestManagerResultsPlugin'}
    end
    
    methods
        function expression = build(obj)
            builder = scriptgen.internal.expressions.test.CreateSimulinkTestResultsPluginSerialExpressionBuilder();
            set(builder, get(obj));
            expression = builder.build();
        end
    end
end


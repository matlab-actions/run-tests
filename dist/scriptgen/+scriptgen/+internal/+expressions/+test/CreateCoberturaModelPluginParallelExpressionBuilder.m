classdef CreateCoberturaModelPluginParallelExpressionBuilder < scriptgen.expressions.test.CreateCoberturaModelPluginParallelExpressionBuilder ...
        & scriptgen.internal.mixin.VersionDependent ...
        & scriptgen.internal.mixin.PathDependent
    % Copyright 2022 The MathWorks, Inc.
    
    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2021b')
        RequiredPathNames = {'sltest.plugins.ModelCoveragePlugin'}
    end
    
    methods        
        function expression = build(obj)
            builder = scriptgen.internal.expressions.test.CreateCoberturaModelPluginSerialExpressionBuilder();
            set(builder, get(obj));
            expression = builder.build();
        end
    end
end


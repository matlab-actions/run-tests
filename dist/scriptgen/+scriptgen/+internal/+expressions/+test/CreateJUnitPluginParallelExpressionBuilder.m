classdef CreateJUnitPluginParallelExpressionBuilder < scriptgen.expressions.test.CreateJUnitPluginParallelExpressionBuilder ...
        & scriptgen.internal.mixin.VersionDependent
    % Copyright 2022 The MathWorks, Inc.
    
    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2018b')
    end
    
    methods
        function expression = build(obj)
            builder = scriptgen.internal.expressions.test.CreateJUnitPluginSerialExpressionBuilder();
            set(builder, get(obj));
            expression = builder.build();
        end
    end
end


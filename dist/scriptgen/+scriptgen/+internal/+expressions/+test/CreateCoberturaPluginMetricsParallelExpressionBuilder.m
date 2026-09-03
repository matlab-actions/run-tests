classdef CreateCoberturaPluginMetricsParallelExpressionBuilder < scriptgen.expressions.test.CreateCoberturaCodePluginParallelExpressionBuilder ...
        & scriptgen.internal.mixin.VersionDependent
    % Copyright 2026 The MathWorks, Inc.

    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2026b')
    end

    methods
        function expression = build(obj)
            builder = scriptgen.internal.expressions.test.CreateCoberturaPluginMetricsSerialExpressionBuilder();
            set(builder, get(obj));
            expression = builder.build();
        end
    end
end

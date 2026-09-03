classdef CreateCoberturaAndHTMLPluginMetricLvlParallelExpressionBuilder < scriptgen.expressions.test.CreateCoberturaAndHTMLCodePluginParallelExpressionBuilder ...
        & scriptgen.internal.mixin.VersionDependent
    % Copyright 2026 The MathWorks, Inc.
    
    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2023a')
    end
    
    methods
        function expression = build(obj)
            builder = scriptgen.internal.expressions.test.CreateCoberturaAndHTMLPluginMetricLvlSerialExpressionBuilder();
            set(builder, get(obj));
            expression = builder.build();
        end
    end
end


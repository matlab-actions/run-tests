classdef CreateHTMLCodePluginMetricLvlParallelExpressionBuilder < scriptgen.expressions.test.CreateHTMLCodePluginParallelExpressionBuilder ...
        & scriptgen.internal.mixin.VersionDependent
    % Copyright 2026 The MathWorks, Inc.
    
    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2023a')
    end
    
    methods
        function expression = build(obj)
            builder = scriptgen.internal.expressions.test.CreateHTMLCodePluginMetricLvlSerialExpressionBuilder();
            set(builder, get(obj));
            expression = builder.build();
        end
    end
end


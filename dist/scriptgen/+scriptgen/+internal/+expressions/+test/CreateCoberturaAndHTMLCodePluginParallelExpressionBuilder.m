classdef CreateCoberturaAndHTMLCodePluginParallelExpressionBuilder < scriptgen.expressions.test.CreateCoberturaAndHTMLCodePluginParallelExpressionBuilder ...
        & scriptgen.internal.mixin.VersionDependent
    % Copyright 2022 The MathWorks, Inc.
    
    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2019a')
    end
    
    methods
        function expression = build(obj)
            builder = scriptgen.internal.expressions.test.CreateCoberturaAndHTMLCodePluginSerialExpressionBuilder();
            set(builder, get(obj));
            expression = builder.build();
        end
    end
end


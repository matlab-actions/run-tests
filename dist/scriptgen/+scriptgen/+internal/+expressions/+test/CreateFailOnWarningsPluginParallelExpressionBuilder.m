classdef CreateFailOnWarningsPluginParallelExpressionBuilder < scriptgen.expressions.test.CreateFailOnWarningsPluginParallelExpressionBuilder ...
        & scriptgen.internal.mixin.VersionDependent
    % Copyright 2022 The MathWorks, Inc.
    
    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2016a')
    end
    
    methods
        function expression = build(obj)
            builder = scriptgen.internal.expressions.test.CreateFailOnWarningsPluginSerialExpressionBuilder();
            set(builder, get(obj));
            expression = builder.build();
        end
    end
end


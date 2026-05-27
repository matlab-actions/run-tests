classdef CreatePDFPluginParallelExpressionBuilder < scriptgen.expressions.test.CreatePDFPluginParallelExpressionBuilder ...
        & scriptgen.internal.mixin.VersionDependent ...
        & scriptgen.internal.mixin.PlatformDependent
    % Copyright 2022 The MathWorks, Inc.
    
    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2018b')
        SupportedPlatforms = {'GLN', 'PC'}
    end
    
    methods
        function expression = build(obj)
            builder = scriptgen.internal.expressions.test.CreatePDFPluginSerialExpressionBuilder();
            set(builder, get(obj));
            expression = builder.build();
        end
    end
end


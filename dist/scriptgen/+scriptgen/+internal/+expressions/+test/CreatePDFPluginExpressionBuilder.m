classdef CreatePDFPluginExpressionBuilder < scriptgen.expressions.test.CreatePDFPluginExpressionBuilder ...
        & scriptgen.internal.mixin.VersionDependent ...
        & scriptgen.internal.mixin.PlatformDependent
    % Copyright 2020 The MathWorks, Inc.
    
    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2017a')
        SupportedPlatforms = {'GLN', 'PC'}
    end
    
    methods
        function expression = build(obj)
            import scriptgen.Expression;
            
            imports = {'matlab.unittest.plugins.TestReportPlugin'};
            
            text = sprintf('TestReportPlugin.producingPDF(%s)', obj.FilePath);
            
            expression = Expression(text, imports);
        end
    end
end


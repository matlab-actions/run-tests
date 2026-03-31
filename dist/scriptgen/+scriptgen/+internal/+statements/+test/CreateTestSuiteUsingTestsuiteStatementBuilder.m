classdef CreateTestSuiteUsingTestsuiteStatementBuilder < scriptgen.statements.test.CreateTestSuiteStatementBuilder ...
        & scriptgen.internal.mixin.VersionDependent
    % Copyright 2020 The MathWorks, Inc.
    
    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2016a')
    end
    
    methods
        function statement = build(obj)
            import scriptgen.Statement;
            
            text = sprintf('%s = testsuite(pwd, ''IncludeSubfolders'', true);', obj.SuiteName);
            
            statement = Statement(text);
        end
    end
end


classdef CreateTestRunnerUsingWithTextOutputStatementBuilder < scriptgen.statements.test.CreateTestRunnerStatementBuilder ...
        & scriptgen.internal.mixin.VersionDependent
    % Copyright 2020 The MathWorks, Inc.
    
    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2013a')
    end
    
    methods
        function statement = build(obj)
            import scriptgen.Statement;
            
            imports = {'matlab.unittest.TestRunner'};
            
            text = sprintf('%s = TestRunner.withTextOutput();', obj.RunnerName);
            
            statement = Statement(text, imports);
        end
    end
end


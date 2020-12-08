classdef CreateTestRunnerUsingWithTextOutputDetailStatementBuilder < scriptgen.statements.test.CreateTestRunnerStatementBuilder ...
        & scriptgen.internal.mixin.VersionDependent
    % Copyright 2020 The MathWorks, Inc.
    
    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2018b')
    end
    
    methods
        function statement = build(obj)
            import scriptgen.Statement;
            
            imports = { ...
                'matlab.unittest.Verbosity', ...
                'matlab.unittest.TestRunner'};
            
            text = sprintf('%s = TestRunner.withTextOutput(''OutputDetail'', Verbosity.Detailed);', obj.RunnerName);
            
            statement = Statement(text, imports);
        end
    end
end


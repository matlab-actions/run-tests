classdef CreateTestRunnerUsingWithTextOutputVerbosityStatementBuilder < scriptgen.statements.test.CreateTestRunnerStatementBuilder ...
        & scriptgen.internal.mixin.VersionDependent
    % Copyright 2020 The MathWorks, Inc.
    
    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2014b')
    end
    
    methods
        function statement = build(obj)
            import scriptgen.Statement;
            
            imports = { ...
                'matlab.unittest.Verbosity', ...
                'matlab.unittest.TestRunner'};
            
            text = sprintf('%s = TestRunner.withTextOutput(''Verbosity'', Verbosity.Detailed);', obj.RunnerName);
            
            statement = Statement(text, imports);
        end
    end
end


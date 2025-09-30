classdef CreateTestRunnerUsingWithTextOutputStatementBuilder < scriptgen.statements.test.CreateTestRunnerStatementBuilder ...
        & scriptgen.internal.mixin.VersionDependent
    % Copyright 2020-2022 The MathWorks, Inc.
    
    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2013a')
    end
    
    methods
        function statement = build(obj)
            import scriptgen.Statement;
            
            imports = {'matlab.unittest.TestRunner'};
            
            text = sprintf('%s = TestRunner.withTextOutput();', obj.RunnerName);

            if ~isempty(obj.LoggingLevel) || ~isempty(obj.OutputDetail)
                text = [text ' % Unable to specify the logging level or output detail in this release of MATLAB.'];
            end
            
            statement = Statement(text, imports);
        end
    end
end


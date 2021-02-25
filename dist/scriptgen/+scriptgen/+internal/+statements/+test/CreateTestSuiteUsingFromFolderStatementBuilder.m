classdef CreateTestSuiteUsingFromFolderStatementBuilder < scriptgen.statements.test.CreateTestSuiteStatementBuilder ...
        & scriptgen.internal.mixin.VersionDependent
    % Copyright 2020 The MathWorks, Inc.
    
    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2013a')
    end
    
    methods
        function statement = build(obj)
            import scriptgen.Statement;
            
            imports = {'matlab.unittest.TestSuite'};
            
            text = sprintf('%s = TestSuite.fromFolder(pwd, ''IncludingSubfolders'', true);', obj.SuiteName);
            
            statement = Statement(text, imports);
        end
    end
end


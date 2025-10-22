classdef CreateTestRunnerUsingTestrunnerStatementBuilder < scriptgen.statements.test.CreateTestRunnerStatementBuilder ...
        & scriptgen.internal.mixin.VersionDependent
    % Copyright 2025 The MathWorks, Inc.

    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2023aU7')
    end

    methods
        function statement = build(obj)
            import scriptgen.Statement;
            import scriptgen.internal.numericVerbosity;
            import scriptgen.internal.Version;
            
            imports = {};
            
            nvpairs = {};
            if ~isempty(obj.LoggingLevel)
                nvpairs{end+1} = sprintf('''LoggingLevel'', %s', num2str(numericVerbosity(obj.LoggingLevel)));
            end
            if ~isempty(obj.OutputDetail)
                nvpairs{end+1} = sprintf('''OutputDetail'', %s', num2str(numericVerbosity(obj.OutputDetail)));
            end
            
            % Use testrunner for releases which support verbosity options with testrunner
            % EXCEPTION: If Simulink test results path is specified, use TestRunner.withTextOutput instead as there's no way
            % to modify the results path with default test runner.
            args = [];
            if ~isempty(which('matlab.internal.metafunction'))
                t = matlab.internal.metafunction('testrunner');
                args = [t.Signature.Inputs.Name];
            elseif ~isempty(which('metafunction'))
                t = metafunction('testrunner');
                identifiers = [t.Signature.Inputs.Identifier];
                argsAsChar = {identifiers.Name};
                args = convertCharsToStrings(argsAsChar);
            end
            if ~obj.HasSimulinkTestResults && any(ismember(args, 'LoggingLevel')) && any(ismember(args, 'OutputDetail'))
                text = sprintf('%s = testrunner(%s);', obj.RunnerName, strjoin(nvpairs,', '));
            else
                imports = {'matlab.unittest.TestRunner'};
                text = sprintf('%s = TestRunner.withTextOutput(%s);', obj.RunnerName, strjoin(nvpairs,', '));
            end
            
            statement = Statement(text, imports);
        end
    end
end

classdef CreateTestRunnerSequenceBuilder < scriptgen.sequences.test.CreateTestRunnerSequenceBuilder ...
        & scriptgen.internal.mixin.VersionDependent
    % Copyright 2020 The MathWorks, Inc.

    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2013a')
    end
    
    methods
        function sequence = build(obj)
            import scriptgen.Sequence;
            
            if ~isempty(obj.CoberturaCodeCoverage) && isempty(obj.SourceFolder)
                error('scriptgen:CreateTestRunner:sourceRequiredForCoberturaCodeCoverage', ...
                    '''SourceFolder'' is required when specifying ''CoberturaCodeCoverage''.');
            end
            
            if ~isempty(obj.HTMLCodeCoverage) && isempty(obj.SourceFolder)
                error('scriptgen:CreateTestRunner:sourceRequiredForHTMLCodeCoverage', ...
                    '''SourceFolder'' is required when specifying ''HTMLCodeCoverage''.');
            end
            
            testCodeProvider = obj.CodeProvider.withSubpackage('test');
            
            statements = testCodeProvider.createStatement('CreateTestRunner', ...
                'RunnerName', obj.RunnerName);
            
            hasPDF = false;
            if ~isempty(obj.PDFTestReport)
                [statements(end+1), hasPDF] = obj.buildPluginStatement(testCodeProvider, 'PDF test reports', ...
                    'CreatePDFPlugin', 'FilePath', obj.PDFTestReport);
            end
            
            if ~isempty(obj.TAPTestResults)
                statements(end+1) = obj.buildPluginStatement(testCodeProvider, 'TAP test results', ...
                    'CreateTAPPlugin', 'FilePath', obj.TAPTestResults);
            end
            
            if ~isempty(obj.JUnitTestResults)
                statements(end+1) = obj.buildPluginStatement(testCodeProvider, 'JUnit test results', ...
                    'CreateJUnitPlugin', 'FilePath', obj.JUnitTestResults);
            end
            
            hasSimTest = false;
            if ~isempty(obj.SimulinkTestResults)
                [statements(end+1), hasSimTest] = obj.buildPluginStatement(testCodeProvider, 'Simulink test results', ...
                    'CreateSimulinkTestResultsPlugin', 'FilePath', obj.SimulinkTestResults);
            end
            
            if hasPDF && ~hasSimTest
                statements = [statements obj.buildAddPluginStatement(testCodeProvider.createExpression('CreateSimulinkTestPlugin'))];
            end
            
            if ~isempty(obj.CoberturaCodeCoverage)
                statements(end+1) = obj.buildPluginStatement(testCodeProvider, 'Cobertura code coverage', ...
                    'CreateCoberturaCodePlugin', 'FilePath', obj.CoberturaCodeCoverage, 'Source', obj.SourceFolder);
            end
            
            if ~isempty(obj.HTMLCodeCoverage)
                statements(end+1) = obj.buildPluginStatement(testCodeProvider, 'HTML code coverage', ...
                    'CreateHTMLCodePlugin', 'FolderPath', obj.HTMLCodeCoverage, 'Source', obj.SourceFolder);
            end
            
            if ~isempty(obj.CoberturaModelCoverage)
                statements(end+1) = obj.buildPluginStatement(testCodeProvider, 'Cobertura model coverage', ...
                    'CreateCoberturaModelPlugin', 'FilePath', obj.CoberturaModelCoverage);
            end
            
            sequence = Sequence(statements);
        end
    end
    
    methods (Access = private)
        function [statement, success] = buildPluginStatement(obj, provider, name, type, varargin)
            import scriptgen.Statement;
            
            statement = obj.buildAddPluginStatement(provider.createExpression(type, varargin{:}));
            if isempty(statement)
                success = false;
                msg = ['Unable to produce ' name '. This problem might be due to a MATLAB release ' ...
                    'or operating system that does not support generating the specified artifact, ' ...
                    'a missing toolbox, or a missing license.'];
                statement = Statement(['% ' msg]);
                warning('scriptgen:featureNotAvailable', msg);
                return;
            end
            
            success = true;
        end
        
        function statement = buildAddPluginStatement(obj, expression)
            import scriptgen.Statement;
            
            if isempty(expression)
                statement = Statement.empty();
                return;
            end
            statement = Statement(sprintf('%s.addPlugin(%s);', obj.RunnerName, expression.Text), expression.RequiredImports);
        end
    end
end
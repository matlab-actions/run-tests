classdef CreateTestRunnerSequenceBuilder < scriptgen.sequences.test.CreateTestRunnerSequenceBuilder ...
        & scriptgen.internal.mixin.VersionDependent
    % Copyright 2020-2022 The MathWorks, Inc.

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
            
            sequence = Sequence.empty();
            
            statements = testCodeProvider.createStatement('CreateTestRunner', ...
                'RunnerName', obj.RunnerName, ...
                'LoggingLevel', obj.LoggingLevel, ...
                'OutputDetail', obj.OutputDetail);
            
            if obj.Strict
                fowStatement = obj.buildPluginStatement(testCodeProvider, 'fails tests when they issue warnings', ...
                    'CreateFailOnWarningsPlugin');
                if isempty(fowStatement)
                    return;
                end
                statements(end+1) = fowStatement;
            end
            
            hasPDF = false;
            if ~isempty(obj.PDFTestReport)
                [pdfStatement, hasPDF] = obj.buildPluginStatement(testCodeProvider, 'generates a PDF test results report', ...
                    'CreatePDFPlugin', 'FilePath', obj.PDFTestReport);
                if isempty(pdfStatement)
                    return;
                end
                statements(end+1) = pdfStatement;
            end
            
            hasHTML = false;
            if ~isempty(obj.HTMLTestReport)
                [htmlReportStatement, hasHTML] = obj.buildPluginStatement(testCodeProvider, 'generates an HTML test results report', ...
                    'CreateHTMLTestReportPlugin', 'FolderPath', obj.HTMLTestReport);
                if isempty(htmlReportStatement)
                    return;
                end
                statements(end+1) = htmlReportStatement;
            end
            
            if ~isempty(obj.TAPTestResults)
                tapStatement = obj.buildPluginStatement(testCodeProvider, 'generates a TAP test results report', ...
                    'CreateTAPPlugin', 'FilePath', obj.TAPTestResults);
                if isempty(tapStatement)
                    return;
                end
                statements(end+1) = tapStatement;
            end
            
            if ~isempty(obj.JUnitTestResults)
                junitStatement = obj.buildPluginStatement(testCodeProvider, 'generates a JUnit test results report', ...
                    'CreateJUnitPlugin', 'FilePath', obj.JUnitTestResults);
                if isempty(junitStatement)
                    return;
                end
                statements(end+1) = junitStatement;
            end
            
            hasSimTest = false;
            if ~isempty(obj.SimulinkTestResults)
                [simResultsStatement, hasSimTest] = obj.buildPluginStatement(testCodeProvider, 'exports Simulink Test Manager results', ...
                    'CreateSimulinkTestResultsPlugin', 'FilePath', obj.SimulinkTestResults);
                if isempty(simResultsStatement)
                    return;
                end
                statements(end+1) = simResultsStatement;
            end
            
            if (hasPDF || hasHTML) && ~hasSimTest
                [simTestStatement, hasSimTest] = obj.buildPluginStatement(testCodeProvider, 'exports Simulink Test Manager results', ...
                    'CreateSimulinkTestPlugin');
                if isempty(simTestStatement)
                    return;
                end
                statements(end+1) = simTestStatement;
            end
            
            if (hasPDF || hasHTML) && hasSimTest && obj.UseParallel && verLessThan('matlab', '9.13')
                % g2730113. Fall back to running serially.
                return;
            end
            
            % More than one CodeCoveragePlugin cannot exist on the same runner if they
            % have overlapping source files.
            hasCodeCov = false;
            if ~isempty(obj.CoberturaCodeCoverage) && ~isempty(obj.HTMLCodeCoverage)
                [dualCodeStatement, hasCodeCov] = obj.buildPluginStatement(testCodeProvider, 'generates Cobertura and HTML code coverage reports', ...
                    'CreateCoberturaAndHTMLCodePlugin', ...
                    'CoberturaFilePath', obj.CoberturaCodeCoverage, ...
                    'HTMLFolderPath', obj.HTMLCodeCoverage, ...
                    'Source', obj.SourceFolder);
                if isempty(dualCodeStatement)
                    return;
                end
                statements(end+1) = dualCodeStatement;
            end
            
            if ~isempty(obj.CoberturaCodeCoverage) && ~hasCodeCov
                [coberturaCodeStatement, hasCodeCov] = obj.buildPluginStatement(testCodeProvider, 'generates a Cobertura code coverage report', ...
                    'CreateCoberturaCodePlugin', 'FilePath', obj.CoberturaCodeCoverage, 'Source', obj.SourceFolder);
                if isempty(coberturaCodeStatement)
                    return;
                end
                statements(end+1) = coberturaCodeStatement;
            end
            
            if ~isempty(obj.HTMLCodeCoverage) && ~hasCodeCov
                [htmlCodeStatement, hasCodeCov] = obj.buildPluginStatement(testCodeProvider, 'generates an HTML code coverage report', ...
                    'CreateHTMLCodePlugin', 'FolderPath', obj.HTMLCodeCoverage, 'Source', obj.SourceFolder); %#ok<NASGU>
                if isempty(htmlCodeStatement)
                    return;
                end
                statements(end+1) = htmlCodeStatement;
            end
            
            if ~isempty(obj.CoberturaModelCoverage)
                coberturaModelStatement = obj.buildPluginStatement(testCodeProvider, 'generates a Cobertura model coverage report', ...
                    'CreateCoberturaModelPlugin', 'FilePath', obj.CoberturaModelCoverage);
                if isempty(coberturaModelStatement)
                    return;
                end
                statements(end+1) = coberturaModelStatement;
            end
            
            if ~isempty(obj.HTMLModelCoverage)
                htmlModelStatement = obj.buildPluginStatement(testCodeProvider, 'generates an HTML model coverage report', ...
                    'CreateHTMLModelPlugin', 'FolderPath', obj.HTMLModelCoverage);
                if isempty(htmlModelStatement)
                    return;
                end
                statements(end+1) = htmlModelStatement;
            end
            
            sequence = Sequence(statements);
        end
    end
    
    methods (Access = private)
        function [statement, success] = buildPluginStatement(obj, provider, purpose, type, varargin)
            import scriptgen.Statement;
            
            statement = Statement.empty();
            success = false;
            
            if obj.UseParallel
                statement = obj.buildAddPluginStatement(provider.createExpression([type 'Parallel'], varargin{:}));
            end
            
            if isempty(statement)
                statement = obj.buildAddPluginStatement(provider.createExpression([type 'Serial'], varargin{:}));
                if ~isempty(statement) && obj.UseParallel
                    % We could not create the parallel statement but we could create the
                    % non-parallel statement. Return empty so we can fall back to running
                    % serially, as we prefer to produce requested artifacts over running in
                    % parallel.
                    warning('scriptgen:featureNotAvailable', ...
                        ['Unable to add a plugin that ' purpose ' while running tests in parallel.']);
                    statement = Statement.empty();
                    return;
                end
            end
            
            if isempty(statement)
                % We could not create the parallel or non-parallel statement. No point in
                % falling back at this point. Put a comment in place of the statement.
                msg = ['Unable to add a plugin that ' purpose '. This problem might be due to a MATLAB release ' ...
                    'or operating system that does not support the plugin, ' ...
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
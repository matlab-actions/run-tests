classdef CreateTestRunnerSequenceBuilder < scriptgen.CodeBuilder
    % Copyright 2020 The MathWorks, Inc.
    
    properties
        CodeProvider = scriptgen.CodeProvider.default()
        RunnerName = 'runner'
        PDFTestReport = ''
        TAPTestResults = ''
        JUnitTestResults = ''
        SimulinkTestResults = ''
        CoberturaCodeCoverage = ''
        HTMLCodeCoverage = ''
        CoberturaModelCoverage = ''
        SourceFolder = {}
    end
    
    methods
        function set.CodeProvider(obj, value)
            validateattributes(value, {'scriptgen.CodeProvider'}, {'scalar'});
            obj.CodeProvider = value;
        end
        
        function set.RunnerName(obj, value)
            scriptgen.internal.validateTextScalar(value);
            obj.RunnerName = value;
        end
        
        function set.PDFTestReport(obj, value)
            scriptgen.internal.validateTextScalar(value);
            obj.PDFTestReport = value;
        end
        
        function set.TAPTestResults(obj, value)
            scriptgen.internal.validateTextScalar(value);
            obj.TAPTestResults = value;
        end
        
        function set.JUnitTestResults(obj, value)
            scriptgen.internal.validateTextScalar(value);
            obj.JUnitTestResults = value;
        end
        
        function set.SimulinkTestResults(obj, value)
            scriptgen.internal.validateTextScalar(value);
            obj.SimulinkTestResults = value;
        end
        
        function set.CoberturaCodeCoverage(obj, value)
            scriptgen.internal.validateTextScalar(value);
            obj.CoberturaCodeCoverage = value;
        end
        
        function set.HTMLCodeCoverage(obj, value)
            scriptgen.internal.validateTextScalar(value);
            obj.HTMLCodeCoverage = value;
        end
        
        function set.CoberturaModelCoverage(obj, value)
            scriptgen.internal.validateTextScalar(value);
            obj.CoberturaModelCoverage = value;
        end
        
        function set.SourceFolder(obj, value)
            scriptgen.internal.validateTextArray(value);
            obj.SourceFolder = value;
        end
    end
end
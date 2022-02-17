classdef TestScriptBuilder < scriptgen.CodeBuilder
    % Copyright 2020 - 2021 The MathWorks, Inc.
    
    properties
        CodeProvider = scriptgen.CodeProvider.default()
        WorkingFolder = ''
        PDFTestReport = ''
        HTMLTestReport = ''
        TAPTestResults = ''
        JUnitTestResults = ''
        SimulinkTestResults = ''
        CoberturaCodeCoverage = ''
        HTMLCodeCoverage = ''
        CoberturaModelCoverage = ''
        HTMLModelCoverage = ''
        SourceFolder = ''
        SelectByFolder = ''
        SelectByTag = ''
    end
    
    methods
        function set.CodeProvider(obj, value)
            validateattributes(value, {'scriptgen.CodeProvider'}, {'scalar'});
            obj.CodeProvider = value;
        end
        
        function set.WorkingFolder(obj, value)
            scriptgen.internal.validateTextScalar(value);
            obj.WorkingFolder = value;
        end
        
        function set.PDFTestReport(obj, value)
            scriptgen.internal.validateTextScalar(value);
            obj.PDFTestReport = value;
        end

        function set.HTMLTestReport(obj, value)
            scriptgen.internal.validateTextScalar(value);
            obj.HTMLTestReport = value;
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

        function set.HTMLModelCoverage(obj, value)
            scriptgen.internal.validateTextScalar(value);
            obj.HTMLModelCoverage = value;
        end

        function set.SourceFolder(obj, value)
            scriptgen.internal.validateText(value);
            obj.SourceFolder = value;
        end
        
        function set.SelectByFolder(obj, value)
            scriptgen.internal.validateText(value);
            obj.SelectByFolder = value;
        end      
        
        function set.SelectByTag(obj, value)
            scriptgen.internal.validateTextScalar(value);
            obj.SelectByTag = value;
        end
    end
end


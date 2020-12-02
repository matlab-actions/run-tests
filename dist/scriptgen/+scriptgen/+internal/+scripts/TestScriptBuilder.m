classdef TestScriptBuilder < scriptgen.scripts.TestScriptBuilder ...
        & scriptgen.internal.mixin.VersionDependent
    % Copyright 2020 The MathWorks, Inc.
    
    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2013a')
    end
    
    methods
        function script = build(obj)
            import scriptgen.Script;
            import scriptgen.Sequence;
            
            testCodeProvider = obj.CodeProvider.withSubpackage('test');
            
            suiteName = 'suite';
            runnerName = 'runner';
            resultsName = 'results';
            
            sequences = Sequence.empty();
            
            if ~isempty(obj.WorkingFolder)
                sequences(end+1) = Sequence(sprintf('cd(''%s'');', escape(obj.WorkingFolder)));
            end
            
            sequences = [sequences obj.buildAddpathSequence()];
            
            sequences(end+1) = testCodeProvider.createSequence('CreateTestSuite', ...
                'CodeProvider', obj.CodeProvider, ...
                'SuiteName', suiteName,...
                'SelectByFolder', quoteCell(splitPath(obj.SelectByFolder)),...
                'SelectByTag', quote(obj.SelectByTag));
            
            sequences = [sequences obj.buildMkdirSequence()];
            
            sequences = [sequences obj.buildDeleteSequence()];
            
            source = obj.SourceFolder;
            if isempty(source)
                source = '.';
            end
            
            sequences(end+1) = testCodeProvider.createSequence('CreateTestRunner', ...
                'CodeProvider', obj.CodeProvider, ...
                'RunnerName', runnerName, ...
                'PDFTestReport', quote(obj.PDFTestReport), ...
                'TAPTestResults', quote(obj.TAPTestResults), ...
                'JUnitTestResults', quote(obj.JUnitTestResults), ...
                'SimulinkTestResults', quote(obj.SimulinkTestResults), ...
                'CoberturaCodeCoverage', quote(obj.CoberturaCodeCoverage), ...
                'HTMLCodeCoverage', quote(obj.HTMLCodeCoverage), ...
                'CoberturaModelCoverage', quote(obj.CoberturaModelCoverage), ...
                'SourceFolder', quoteCell(splitPath(source)));
            
            sequences(end+1) = Sequence( ...
                sprintf('%s = %s.run(%s);', resultsName, runnerName, suiteName));
            
            sequences(end+1) = testCodeProvider.createSequence('AssertNoFailures', ...
                'CodeProvider', obj.CodeProvider, ...
                'ResultsName', resultsName);
            
            script = Script(sequences);
        end
    end
    
    methods (Access = private)
        function s = buildAddpathSequence(obj)
            import scriptgen.Sequence;
            
            dirs = splitPath(obj.SourceFolder);
            
            if isempty(dirs)
                s = Sequence.empty();
                return;
            end
            
            for i = numel(dirs):-1:1
                code{i} = sprintf('addpath(genpath(''%s''));', escape(dirs{i}));
            end
            s = Sequence(code);
        end
        
        function s = buildMkdirSequence(obj)
            import scriptgen.Sequence;
            
            dirs = cellfun(@(f)fileparts(f), { ...
                obj.PDFTestReport, ...
                obj.TAPTestResults, ...
                obj.JUnitTestResults, ...
                obj.SimulinkTestResults, ...
                obj.CoberturaCodeCoverage, ...
                obj.HTMLCodeCoverage, ...
                obj.CoberturaModelCoverage}, ...
                'UniformOutput', false);
            dirs = dirs(~cellfun(@isempty, dirs));
            dirs = unique(dirs);
            
            if isempty(dirs)
                s = Sequence.empty();
                return;
            end
            
            for i = numel(dirs):-1:1
                code{i} = sprintf('[~,~] = mkdir(''%s'');', escape(dirs{i}));
            end
            s = Sequence(code);
        end
        
        function s = buildDeleteSequence(obj)
            import scriptgen.Sequence;
            import scriptgen.internal.isAbsolutePath;
            
            % Only pre-existing TAP results need to be explicitly deleted 
            % at the moment. Other artifacts are automatically overwritten
            % by their respective plugin.
            files = {obj.TAPTestResults};
            files = files(~cellfun(@isempty, files));
            files = unique(files);
            
            if isempty(files)
                s = Sequence.empty();
                return;
            end
            
            code = {};
            for i = 1:numel(files)
                filePath = escape(files{i});
                if ~isAbsolutePath(filePath)
                    fullFilePath = sprintf('fullfile(pwd, ''%s'')', filePath);
                else
                    fullFilePath = sprintf('''%s''', filePath);
                end
                c{1} = sprintf('if exist(%s, ''file'') == 2', fullFilePath);
                c{2} = sprintf('    delete(''%s'');', filePath);
                c{3} = sprintf('end');
                code = [code c]; %#ok<AGROW>
            end
            s = Sequence(code);
        end
    end
end

function text = splitPath(text)
if iscellstr(text) %#ok<ISCLSTR>
    return;
elseif isempty(text)
    text = {};
else
    text = strtrim(strsplit(text, {';', ':'}));
end
end

function text = quote(text)
if isempty(text)
    return;
end
text = ['''' escape(text) ''''];
end

function text = quoteCell(text)
text = cellfun(@(t)['''' t ''''], escape(text), 'UniformOutput', false);
end

function text = escape(text)
if isempty(text)
    return;
end
text = strrep(text, '''', '''''');
end

classdef TestScriptBuilder < scriptgen.scripts.TestScriptBuilder ...
        & scriptgen.internal.mixin.VersionDependent
    % Copyright 2020-2024 The MathWorks, Inc.
    
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
                'SelectByTag', quote(obj.SelectByTag), ...
                'SelectByName', obj.SelectByName);
            
            sequences = [sequences obj.buildMkdirSequence()];
            
            runnerSequence = Sequence.empty();
            
            if obj.UseParallel
                [canUseParallel, cannotUseParallelMsg] = canRunInParallel();
                if canUseParallel
                    runnerSequence = obj.buildCreateTestRunnerSequence(testCodeProvider, runnerName, true);
                    if isempty(runnerSequence)
                        msg = ['Unable to generate all artifacts while running tests in parallel. ' ...
                            'Running tests in serial instead.'];
                        sequences(end+1) = Sequence(['% ' msg]);
                        warning('scriptgen:featureNotAvailable', msg);
                    end
                else
                    msg = [cannotUseParallelMsg '. Running tests in serial instead.'];
                    sequences(end+1) = Sequence(['% ' msg]);
                    warning('scriptgen:featureNotAvailable', msg);
                end
            end
            
            if isempty(runnerSequence)
                sequences = [sequences obj.buildDeleteTAPResultsSequence()];
                runnerSequence = obj.buildCreateTestRunnerSequence(testCodeProvider, runnerName, false);
                runStatement = sprintf('%s = %s.run(%s);', resultsName, runnerName, suiteName);
            else
                runStatement = sprintf('%s = %s.runInParallel(%s);', resultsName, runnerName, suiteName);
            end
            
            sequences(end+1) = runnerSequence;
            sequences(end+1) = Sequence({ ...
                runStatement, ...
                sprintf('display(%s);', resultsName)});
            
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
                obj.CoberturaModelCoverage}, ...
                'UniformOutput', false);
            
            % TAP results require a folder when running in parallel
            if ~isempty(obj.TAPTestResults) && obj.UseParallel
                [fp,name] = fileparts(obj.TAPTestResults);
                dirs = [dirs {fullfile(fp,name)}];
            end

            % HTML artifacts take in folder path
            htmlDirs = {obj.HTMLTestReport, ...
                       obj.HTMLCodeCoverage, ...
                       obj.HTMLModelCoverage};

            dirs = [dirs htmlDirs];

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
        
        function s = buildDeleteTAPResultsSequence(obj)
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
        
        function s = buildCreateTestRunnerSequence(obj, provider, runnerName, useParallel)
            source = obj.SourceFolder;
            if isempty(source)
                source = '.';
            end
            
            s = provider.createSequence('CreateTestRunner', ...
                'CodeProvider', obj.CodeProvider, ...
                'RunnerName', runnerName, ...
                'PDFTestReport', quote(obj.PDFTestReport), ...
                'HTMLTestReport', quote(obj.HTMLTestReport), ...
                'TAPTestResults', quote(obj.TAPTestResults), ...
                'JUnitTestResults', quote(obj.JUnitTestResults), ...
                'SimulinkTestResults', quote(obj.SimulinkTestResults), ...
                'CoberturaCodeCoverage', quote(obj.CoberturaCodeCoverage), ...
                'HTMLCodeCoverage', quote(obj.HTMLCodeCoverage), ...
                'CoberturaModelCoverage', quote(obj.CoberturaModelCoverage), ...
                'HTMLModelCoverage', quote(obj.HTMLModelCoverage), ...
                'SourceFolder', quoteCell(splitPath(source)), ...
                'LoggingLevel', obj.LoggingLevel, ...
                'OutputDetail', obj.OutputDetail, ...
                'Strict', obj.Strict, ...
                'UseParallel', useParallel);
        end
    end
end

function [tf,msg] = canRunInParallel()
tf = false;
msg = '';

mc = meta.class.fromName('matlab.unittest.TestRunner');
runInParallelMethod = mc.MethodList.findobj('Name', 'runInParallel');
if isempty(runInParallelMethod)
    msg = 'Unable to find a runInParallel method on matlab.unittest.TestRunner';
    return;
end

licenseName = 'Distrib_Computing_Toolbox';
if ~license('test', licenseName)
    msg = 'Unable to find a license for Parallel Computing Toolbox';
    return;
end

[canCheckout,~] = license('checkout', licenseName);
if ~canCheckout
    msg = 'Unable to check out a license for Parallel Computing Toolbox';
    return;
end

if isempty(gcp())
    msg = 'Unable to get or start a parallel pool';
    return;
end

tf = true;
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

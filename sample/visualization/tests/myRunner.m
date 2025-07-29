import matlab.unittest.TestRunner;
import matlab.unittest.internal.TestSessionData;

% clear;

suite = testsuite(pwd, 'IncludeSubfolders', true);
runner = TestRunner.withDefaultPlugins();
% runner = testrunner('OutputDetail', 'Verbose');
results = runner.run(suite);

%% GENERATE JSON FILE

% fid = fopen('testResultsViewArtifact.json','w');
% fprintf(fid,'%s',jsonencode(results, 'PrettyPrint', true));
% fclose(fid);

% testSessionData = TestSessionData(suite,results);
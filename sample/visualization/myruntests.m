import matlab.unittest.TestRunner;
addpath(genpath('code'));
addpath(genpath('tests'));
suite = testsuite(pwd, 'IncludeSubfolders', true);
runner = TestRunner.withDefaultPlugins();
plugin = matlab.unittest.plugins.XMLPlugin.producingJUnitFormat("results.xml");
addPlugin(runner,plugin)
results = runner.run(suite);
display(results);
assertSuccess(results);
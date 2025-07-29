% function plan = buildfile
% plan = buildplan(localfunctions);
% plan("test").Dependencies = "build";
% plan("deploy").Dependencies = "test";
% 
% plan.DefaultTasks = "test";
% 
% function buildTask(~)
% f = fopen('buildlog.txt', 'a+'); fprintf(f, 'building\n'); fclose(f);
% 
% function testTask(~,tests,options)
% arguments
%     ~
%     tests string = pwd
%     options.OutputDetail (1,1) string = "terse"
% end
% f = fopen('buildlog.txt', 'a+');
% fprintf(f, 'testing\n');
% fprintf(f, '%s\n', tests);
% fprintf(f, '%s\n', options.OutputDetail);
% fclose(f);
% 
% function deployTask(~)
% f = fopen('buildlog.txt', 'a+'); fprintf(f, 'deploying\n'); fclose(f);
% 
% function checkTask(~)
% f = fopen('buildlog.txt', 'a+'); fprintf(f, 'checking\n'); fclose(f);

%%

function plan = buildfile
import matlab.buildtool.tasks.TestTask

% Create a plan with no tasks
plan = buildplan(localfunctions);
plan.DefaultTasks = "test";

% Add a task to run the tests in the project
plan("test") = TestTask;
end

function myTask(~)
    disp('Hello World!')
end
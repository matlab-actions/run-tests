classdef GitHubLogTestPluginService < matlab.buildtool.internal.services.ciplugins.CITestRunnerPluginService
    % Copyright 2025 The MathWorks, Inc.

    methods
        function plugins = providePlugins(~, ~)
            plugins = testframework.GitHubLogTestPlugin();
        end
    end
end
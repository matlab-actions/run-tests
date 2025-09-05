classdef GitHubLogPluginService < matlab.buildtool.internal.services.ciplugins.CITestRunnerPluginService
    % Copyright 2025 The MathWorks, Inc.

    methods
        function plugins = providePlugins(~, ~)
            plugins = ciplugins.github.GitHubLogPlugin();
        end
    end
end
classdef CreateHTMLTestReportPluginExpressionBuilder < scriptgen.CodeBuilder
    % Copyright 2021 The MathWorks, Inc.

    properties
        FolderPath = '''report'''
    end

    methods
        function set.FolderPath(obj, value)
            scriptgen.internal.validateTextScalar(value);
            obj.FolderPath = value;
        end
    end
end
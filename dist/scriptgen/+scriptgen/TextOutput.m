classdef TextOutput < scriptgen.OutputStream
    % Copyright 2020 The MathWorks, Inc.
    
    properties (SetAccess = private)
        Text
    end
    
    methods
        function write(obj, text)
            obj.Text = [obj.Text sprintf('%s', text)];
        end
    end
end


classdef OutputStream < handle
    % Copyright 2020 The MathWorks, Inc.
    
    methods
        function close(~)
            % Available for subclasses to override
        end
    end
    
    methods (Abstract)
        write(obj, text);
    end
end


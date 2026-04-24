classdef MissingCodeBuilder < scriptgen.CodeBuilder
    % Copyright 2020 The MathWorks, Inc.
    
    methods
        function code = build(~) %#ok<STOUT>
            error('Called build on MissingCodeBuilder');
        end
    end
end


classdef MissingCode < scriptgen.Code
    % Copyright 2020 The MathWorks, Inc.
    
    methods (Access={?scriptgen.CodeWriter, ?scriptgen.Code})
        function write(~, ~)
            error('Called write on MissingCode');
        end
    end
end


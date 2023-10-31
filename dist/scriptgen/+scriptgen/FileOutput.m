classdef FileOutput < scriptgen.OutputStream
    % Copyright 2020 The MathWorks, Inc.
    
    properties (GetAccess = private, SetAccess = immutable)
        Fid
    end
    
    methods
        function obj = FileOutput(filename)
            obj.Fid = fopen(filename, 'w');
        end
        
        function write(obj, text)
            fprintf(obj.Fid, '%s', text);
        end
        
        function close(obj)
            fclose(obj.Fid);
        end
    end
end


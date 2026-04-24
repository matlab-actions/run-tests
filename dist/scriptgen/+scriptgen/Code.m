classdef Code < matlab.mixin.Heterogeneous
    % Code - Base class for all classes writable by CodeWriter
    
    % Copyright 2020 The MathWorks, Inc.
    
    properties (SetAccess = immutable)
        Contents
    end
    
    methods
        function contents = get.Contents(obj)
            import scriptgen.TextOutput;
            stream = TextOutput();
            obj.writeToStream(stream);
            contents = stream.Text;
        end
    end
    
    methods (Abstract, Access={?scriptgen.CodeWriter, ?scriptgen.Code})
        write(obj, writer)
    end
    
    methods (Access = protected)
        function writeToStream(obj, stream)
            import scriptgen.CodeWriter;
            writer = CodeWriter(stream);
            close = onCleanup(@()writer.close());
            obj.write(writer);
        end
    end
    
    methods (Static, Sealed, Access = protected)
       function builder = getDefaultScalarElement()
           builder = scriptgen.internal.MissingCode();
       end
    end
end


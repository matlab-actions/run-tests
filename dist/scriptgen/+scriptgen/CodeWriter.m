classdef CodeWriter < handle
    % CodeWriter - Writes code objects in to code
    
    % Copyright 2020 The MathWorks, Inc.
    
    properties (Access = private)
        OutputStream
        WhitespaceBuffer
    end
    
    methods
        function obj = CodeWriter(stream)
            validateattributes(stream, {'scriptgen.OutputStream'}, {'scalar'});
            obj.OutputStream = stream;
        end
        
        function writeExpression(obj, expression)
            obj.flushWhitespaceBuffer();
            expression.write(obj);
        end
        
        function writeStatement(obj, statement)
            obj.flushWhitespaceBuffer();
            statement.write(obj);
            obj.bufferNewLine();
        end
        
        function writeSequence(obj, sequence)
            obj.flushWhitespaceBuffer();
            sequence.write(obj);
            obj.bufferNewLine();
        end
        
        function writeScript(obj, script)
            obj.flushWhitespaceBuffer();
            script.write(obj);
        end
        
        function close(obj)
            obj.OutputStream.close();
        end
    end
    
    methods (Access = {?scriptgen.Code})
        function write(obj, format, varargin)
            text = sprintf(format, varargin{:});
            obj.OutputStream.write(text);
        end
    end
    
    methods (Access = private)        
        function bufferNewLine(obj)
            obj.WhitespaceBuffer = strcat(obj.WhitespaceBuffer, '\n');
        end
        
        function flushWhitespaceBuffer(obj)
            if ~isempty(obj.WhitespaceBuffer)
                obj.write(obj.WhitespaceBuffer);
                obj.WhitespaceBuffer = [];
            end
        end
    end
end


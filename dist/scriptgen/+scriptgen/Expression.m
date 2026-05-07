classdef Expression < scriptgen.Code
    % Expression - A unit of code that returns a value
    %
    %   Expressions are typically located in statements on the right- or
    %   left-hand side of an equals sign.
    %
    %   Example expressions:
    %   
    %       1 + 2
    %       zeros(5,1)
    %       A(1:3,2)
    
    % Copyright 2020 The MathWorks, Inc.
    
    properties (SetAccess = immutable)
        Text
        RequiredImports
    end
    
    methods
        function obj = Expression(text, imports)
            if nargin < 2
                imports = {};
            end
            if ischar(imports)
                imports = {imports};
            end
            scriptgen.internal.validateTextScalar(text);
            scriptgen.internal.validateTextArray(imports);
            
            obj.Text = text;
            obj.RequiredImports = imports;
        end
    end
    
    methods (Access={?scriptgen.CodeWriter, ?scriptgen.Code})
        function write(obj, writer)
            writer.write('%s', obj.Text);
        end
    end
end


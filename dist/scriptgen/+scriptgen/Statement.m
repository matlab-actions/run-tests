classdef Statement < scriptgen.Code
    % Statement - A unit of code that executes an action
    %
    %   Statements are typically terminated with a semicolon.
    %
    %   Example statements:
    %
    %       a = 1 + 2;
    %       disp('hello world');
    %       z = zeros(5,1);
    
    % Copyright 2020 The MathWorks, Inc.
    
    properties (SetAccess = immutable)
        Text
        RequiredImports
    end
    
    methods
        function obj = Statement(text, imports)
            import scriptgen.internal.validateTextArray;
            import scriptgen.internal.validateTextArray;
            
            if nargin < 2
                imports = {};
            end
            if ischar(text)
                text = {text};
            end
            if ischar(imports)
                imports = {imports};
            end
            validateTextArray(text);
            validateTextArray(imports);
            
            % Support array construction.
            m = size(text, 1);
            n = size(text, 2);
            obj(1:m,1:n) = obj;
            for i = 1:m
                for j = 1:n
                    obj(i,j).Text = text{i,j};
                    obj(i,j).RequiredImports = imports;
                end
            end
        end
    end
    
    methods (Access={?scriptgen.CodeWriter, ?scriptgen.Code})
        function write(obj, writer)
            writer.write('%s', obj.Text);
        end
    end
end


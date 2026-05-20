classdef Sequence < scriptgen.Code
    % Sequence - A collection of statements that achieve a task
    
    % Copyright 2020 The MathWorks, Inc.
    
    properties (SetAccess = immutable)
        Statements
        RequiredImports
    end
    
    methods
        function obj = Sequence(statements)
            import scriptgen.Statement;
            
            if iscellstr(statements) || (ischar(statements) && isvector(statements)) %#ok<ISCLSTR>
                statements = Statement(statements);
            end
            validateattributes(statements, {'scriptgen.Statement'}, {'vector'});
            
            obj.Statements = statements;
            
            % unique may return 0x1 cell array, valueOrElse ensures it is
            % converted to a 0x0 cell array.
            obj.RequiredImports = valueOrElse(unique([statements.RequiredImports]), {});
        end
    end
    
    methods (Access={?scriptgen.CodeWriter, ?scriptgen.Code})
        function write(obj, writer)
            for s = obj.Statements
                writer.writeStatement(s);
            end
        end
    end
end

function v = valueOrElse(value, default)
if ~isempty(value)
    v = value;
else
    v = default;
end
end
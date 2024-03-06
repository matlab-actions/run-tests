classdef (Abstract) SetGet < handle
    % SetGet - A primitive alternative to matlab.mixin.SetGet that works
    %   with releases prior to R2014b
    
    % Copyright 2020-2022 The MathWorks, Inc.
    
    methods
        function set(obj, varargin)
            if nargin == 2
                value = varargin{1};
                names = fieldnames(value);
                for i = 1:numel(names)
                    obj.(names{i}) = value.(names{i});
                end
                return;
            end
            for i = 1:2:numel(varargin)
                obj.(varargin{i}) = varargin{i+1};
            end
        end
        
        function value = get(obj, name)
            if nargin == 1
                value = struct();
                props = properties(obj);
                for i = 1:numel(props)
                    value.(props{i}) = obj.(props{i});
                end
                return;
            end
            value = obj.(name);
        end
    end
end


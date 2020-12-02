classdef (Abstract) SetGet < handle
    % SetGet - A primitive alternative to matlab.mixin.SetGet that works
    %   with releases prior to R2014b
    
    % Copyright 2020 The MathWorks, Inc.
    
    methods
        function set(obj, varargin)
            for i = 1:2:numel(varargin)
                obj.(varargin{i}) = varargin{i+1};
            end
        end
        
        function value = get(obj, name)
            value = obj.(name);
        end
    end
end


classdef (Hidden, HandleCompatible) EnvironmentDependent
    % EnvironmentDependent - Base class for mixins that indicate a class is
    %   dependent on the runtime environment in some way
    %
    %   When a mixin class subclasses EnvironmentDependent, it should call
    %   the addIsSupportedFunction method in its constructor and add a
    %   function that evaluates to true/false depending on the current 
    %   runtime environment.
    
    % Copyright 2020 The MathWorks, Inc.
    
    properties (Access = private)
        IsSupportedFunctions
    end
    
    methods
        function tf = isSupportedByCurrentEnvironment(obj)
            for i = 1:numel(obj.IsSupportedFunctions)
                isSupported = obj.IsSupportedFunctions{i};
                if ~isSupported(obj)
                    tf = false;
                    return;
                end
            end
            tf = true;
        end
    end
    
    methods (Hidden, Access = protected)
        function obj = EnvironmentDependent()
            if isempty(obj.IsSupportedFunctions)
                obj.IsSupportedFunctions = {};
            end
        end
        
        function obj = addIsSupportedFunction(obj, fcn)
            obj.IsSupportedFunctions{end+1} = fcn;
        end
    end
end


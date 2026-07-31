classdef (Hidden, HandleCompatible) PathDependent < scriptgen.internal.mixin.EnvironmentDependent
    % PathDependent - Indicates a class requires a set of path names on the
    %   current MATLAB search path
    
    % Copyright 2020 The MathWorks, Inc.
    
    properties (Abstract, Constant, Access = protected)
        RequiredPathNames
    end
    
    methods (Hidden, Access = protected)
        function obj = PathDependent()
            obj = obj.addIsSupportedFunction(@requiredNamesExistOnCurrentPath);
        end
    end
    
    methods (Access = protected)
        function tf = requiredNamesExistOnCurrentPath(obj)
            ret = cellfun(@(n)exist(n), obj.RequiredPathNames); %#ok<EXIST>
            tf = all(ismember(ret, [2 3 4 5 6 7 8]));
        end
    end
end


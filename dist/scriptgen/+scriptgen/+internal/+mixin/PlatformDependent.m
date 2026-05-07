classdef (Hidden, HandleCompatible) PlatformDependent < scriptgen.internal.mixin.EnvironmentDependent
    % PlatformDependent - Indicates a class requires a particular runtime
    %   platform like PCWIN64 or MACI64
    
    % Copyright 2020 The MathWorks, Inc.
    
    properties (Abstract, Constant, Access = protected)
        SupportedPlatforms
    end
    
    methods (Hidden, Access = protected)
        function obj = PlatformDependent()
            obj = obj.addIsSupportedFunction(@isSupportedByCurrentPlatform);
        end
    end
    
    methods (Access = protected)
        function tf = isSupportedByCurrentPlatform(obj)
            exp = ['^(' strjoin(obj.SupportedPlatforms, '|') ')\w*'];
            matches = regexp(computer(), exp, 'once');
            tf = any(matches);
        end
    end
end


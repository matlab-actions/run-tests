classdef (Hidden, HandleCompatible) VersionDependent < scriptgen.internal.mixin.EnvironmentDependent ...
        & scriptgen.internal.mixin.Preferable
    % VersionDependent - Indicates a class requires a particular version of
    %   MATLAB
    
    % Copyright 2020 The MathWorks, Inc.
    
    properties (Abstract, Constant, Access = protected)
        MinSupportedVersion
    end
    
    methods (Hidden, Access = protected)
        function obj = VersionDependent()
            obj = obj.addIsSupportedFunction(@isSupportedByCurrentVersion);
            obj = obj.addPreferabilityComparator('scriptgen.internal.mixin.VersionDependent', @comparePreferabilityByMinVersion);
        end
    end
    
    methods (Access = protected)
        function tf = isSupportedByCurrentVersion(obj)
            import scriptgen.internal.Version;
            tf = obj.MinSupportedVersion <= Version.forCurrentRelease();
        end
    end
end

function p = comparePreferabilityByMinVersion(a, b)
    if ~isa(a, 'scriptgen.internal.mixin.VersionDependent') && ~isa(b, 'scriptgen.internal.mixin.VersionDependent')
        p = 0;
    elseif ~isa(a, 'scriptgen.internal.mixin.VersionDependent')
        p = -1;
    elseif ~isa(b, 'scriptgen.internal.mixin.VersionDependent')
        p = 1;
    elseif a.MinSupportedVersion == b.MinSupportedVersion
        p = 0;
    elseif a.MinSupportedVersion < b.MinSupportedVersion
        p = -1;
    else
        p = 1;
    end
end
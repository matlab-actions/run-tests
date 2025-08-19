classdef CodeBuilder < matlab.mixin.Heterogeneous & scriptgen.internal.mixin.SetGet ...
        & scriptgen.internal.mixin.EnvironmentDependent ...
        & scriptgen.internal.mixin.Preferable
    % CodeBuilder - Base class for builders of immutable code objects
    
    % Copyright 2020 The MathWorks, Inc.
    
    methods (Abstract)
        code = build(obj)
    end
    
    methods (Static, Sealed, Access = protected)
       function builder = getDefaultScalarElement()
           builder = scriptgen.internal.MissingCodeBuilder();
       end
    end
end


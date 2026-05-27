classdef AssertNoFailuresWithAssertSuccessSequenceBuilder < scriptgen.sequences.test.AssertNoFailuresSequenceBuilder ...
        & scriptgen.internal.mixin.VersionDependent
    % Copyright 2022 The MathWorks, Inc.
    
    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2020a')
    end
    
    methods
        function sequence = build(obj)
            import scriptgen.Sequence;
            
            sequence = Sequence( ...
                sprintf('assertSuccess(%s);', obj.ResultsName));
        end
    end
end


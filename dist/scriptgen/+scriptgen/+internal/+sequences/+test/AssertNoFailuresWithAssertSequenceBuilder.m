classdef AssertNoFailuresWithAssertSequenceBuilder < scriptgen.sequences.test.AssertNoFailuresSequenceBuilder ...
        & scriptgen.internal.mixin.VersionDependent
    % Copyright 2020-2022 The MathWorks, Inc.
    
    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2013a')
    end
    
    methods
        function sequence = build(obj)
            import scriptgen.Sequence;
            
            sequence = Sequence( ...
                sprintf('assert(~any([%s.Failed]), ''At least one test failed in the test session.'');', obj.ResultsName));
        end
    end
end


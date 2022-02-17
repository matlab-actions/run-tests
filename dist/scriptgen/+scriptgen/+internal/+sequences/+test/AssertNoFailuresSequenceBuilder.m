classdef AssertNoFailuresSequenceBuilder < scriptgen.sequences.test.AssertNoFailuresSequenceBuilder ...
        & scriptgen.internal.mixin.VersionDependent
    % Copyright 2020 The MathWorks, Inc.
    
    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2013a')
    end
    
    methods
        function sequence = build(obj)
            import scriptgen.Sequence;
            
            sequence = Sequence({ ...
                sprintf('nfailed = nnz([%s.Failed]);', obj.ResultsName), ...
                'assert(nfailed == 0, [num2str(nfailed) '' test(s) failed.'']);'});
        end
    end
end


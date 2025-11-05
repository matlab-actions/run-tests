classdef tAssumptionFailure < matlab.unittest.TestCase
    methods (Test)
        function testAssumptionFailure(testCase)
            testCase.assumeEqual(1+1, 11);
        end
    end
end

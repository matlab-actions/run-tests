classdef tFatalAssertionFailure < matlab.unittest.TestCase
    methods (Test)
        function testFatalAssertionFailure(testCase)
            testCase.fatalAssertEqual(1+1, 11);
        end

        function testNotRun(testCase)
            onetyone = 11;
            testCase.verifyEqual(onetyone, 11);
        end
    end
end

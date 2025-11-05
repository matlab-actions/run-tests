classdef tVerificationAndAssertionFailure < matlab.unittest.TestCase
    methods (Test)
        function testVerificationFailure(testCase)
            % Two verifications to show that the test continues after a verification failure
            testCase.verifyEqual(1+1, 11);
            testCase.verifyEqual(1+1, 11);
        end

        function testAssertionFailure(testCase)
            % Two assertions to show that the test ends after an assertion failure
            testCase.assertEqual(1+1, 11);
            testCase.assertEqual(1+1, 11);
        end
    end
end

classdef TheTruth < matlab.unittest.TestCase
    methods (Test)
        function testTheTestOfAllTime(testCase)
            onetyone = 11;
            testCase.verifyEqual(onetyone, 11);
        end

        function testAssumptionFailure(testCase)
            testCase.assumeTrue(1+1, 11);
        end

        function testVerificationFailure(testCase)
            testCase.verifyEqual(1+1, 11);
        end

        function testAssertionFailure(testCase)
            testCase.assertEqual(1+1, 11);
        end

        function testFatalAssertionFailure(testCase)
            testCase.fatalAssertEqual(1+1, 11);
        end

        function testNotRun(testCase)
            onetyone = 11;
            testCase.verifyEqual(onetyone, 11);
        end
    end
end

classdef QuadraticPolynomialTest1 < matlab.unittest.TestCase
    methods (Test)
        function realSolution(testCase)
            p = QuadraticPolynomial(1,-3,2);
            actSolution = p.solve();
            expSolution = [1 2];
            testCase.verifyEqual(actSolution,expSolution)
        end
        function imaginarySolution(testCase)
            p = QuadraticPolynomial(1,2,10);
            actSolution = p.solve();
            expSolution = [-1-3i -1+3i];
            testCase.verifyEqual(actSolution,expSolution)
        end
    end
end
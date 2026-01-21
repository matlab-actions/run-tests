classdef CircleCalculatorTest < matlab.unittest.TestCase
    % Tests for the CircleCalculator class
    
    methods (Test)
        function testArea(testCase)
            % Test the area calculation
            circle = CircleCalculator(5);
            expectedArea = pi * 25;
            actualArea = circle.calculateArea();
            testCase.verifyEqual(actualArea, expectedArea);
        end
        
        function testCircumference(testCase)
            % Test the circumference calculation
            circle = CircleCalculator(3);
            expectedCircumference = 2 * pi * 3;
            actualCircumference = circle.calculateCircumference();
            testCase.verifyEqual(actualCircumference, expectedCircumference);
        end
        
        function testPointOnCircle(testCase)
            % Test getting a point on the circle
            circle = CircleCalculator(1);
            [x, y] = circle.getPointOnCircle(0);
            testCase.verifyEqual([x, y], [1, 0], 'AbsTol', 1e-10);
            
            [x, y] = circle.getPointOnCircle(pi/2);
            testCase.verifyEqual([x, y], [0, 1], 'AbsTol', 1e-10);
        end
    end
end

classdef CircleCalculator
    % CircleCalculator - A class for calculating circle properties
    
    properties
        Radius
    end
    
    methods
        function obj = CircleCalculator(radius)
            % Constructor - validate and set the radius
            if ~isnumeric(radius) || radius <= 0
                error('CircleCalculator:InvalidRadius', ...
                    'Radius must be a positive number');
            end
            obj.Radius = radius;
        end
        
        function area = calculateArea(obj)
            % Calculate the area of the circle
            area = pi * obj.Radius^2;
        end
        
        function circumference = calculateCircumference(obj)
            % Calculate the circumference of the circle
            circumference = 2 * pi * obj.Radius;
        end
        
        function [x, y] = getPointOnCircle(obj, angle)
            % Get coordinates of a point on the circle at the given angle
            if ~isnumeric(angle)
                error('CircleCalculator:InvalidAngle', ...
                    'Angle must be numeric');
            end
            x = obj.Radius * cos(angle);
            y = obj.Radius * sin(angle);
        end
        
        function plotCircle(obj, ax)
            % Plot the circle on the given axes
            if nargin < 2 || isempty(ax)
                ax = gca;
            end
            
            theta = linspace(0, 2*pi, 100);
            x = obj.Radius * cos(theta);
            y = obj.Radius * sin(theta);
            
            plot(ax, x, y);
            axis(ax, 'equal');
            title(ax, ['Circle with radius ' num2str(obj.Radius)]);
        end
    end
end

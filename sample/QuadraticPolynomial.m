classdef QuadraticPolynomial
    properties
        A,B,C   % Coefficients of a*x^2 + b*x + c
    end

    methods
        function obj = QuadraticPolynomial(a,b,c)
            if ~isa(a,"numeric") || ~isa(b,"numeric") || ~isa(c,"numeric")
                error("QuadraticPolynomial:InputMustBeNumeric", ...
                    "Coefficients must be numeric.")
            else
                obj.A = a; obj.B = b; obj.C = c;
            end
        end

        function r = solve(obj)
            % Return solutions to a*x^2 + b*x + c = 0
            delta = calculateDelta(obj);
            r(1) = (-obj.B - sqrt(delta)) / (2*obj.A);
            r(2) = (-obj.B + sqrt(delta)) / (2*obj.A);
        end

        function plot(obj,ax)
            % Plot a*x^2 + b*x + c around its axis of symmetry
            delta = calculateDelta(obj);
            x0 = -obj.B/(2*obj.A);
            x1 = abs(sqrt(delta))/obj.A;
            x = x0 + linspace(-x1,x1);
            y = obj.A*x.^2 + obj.B*x + obj.C;
            plot(ax,x,y)
            xlabel("x")
            ylabel(sprintf("%.2fx^2%+.2fx%+.2f",obj.A,obj.B,obj.C))
        end
    end

    methods (Access=private)
        function delta = calculateDelta(obj)
            delta = obj.B^2 - 4*obj.A*obj.C;
        end
    end
end
classdef CodeBuilderFactory < handle
    % CodeBuilderFactory - Factory that creates CodeBuilders
    
    % Copyright 2020 The MathWorks, Inc.
    
    properties (Access = private)
        Locator
    end
    
    methods
        function obj = CodeBuilderFactory(locator)
            obj.Locator = locator;
        end
        
        function builder = create(obj, type)
            % create - Creates a single CodeBuilder
            %
            %   Creates the most preferable CodeBuilder supported by the
            %   current runtime environment or empty.
            
            import scriptgen.internal.MissingCodeBuilder;
            
            metaclasses = obj.Locator.locate(type);
            builder = MissingCodeBuilder.empty();
            for i = numel(metaclasses):-1:1
                constructor = str2func(metaclasses(i).Name);
                builder(i) = constructor();
            end
            
            isSupported = arrayfun(@(b)b.isSupportedByCurrentEnvironment(), builder);
            builder = builder(isSupported);
            
            if numel(builder) > 1
                builder = builder.sortByPreferability();
                builder = builder(end);
            end
        end
    end
end


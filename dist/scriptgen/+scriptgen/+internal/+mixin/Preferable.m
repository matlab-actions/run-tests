classdef (Hidden, HandleCompatible) Preferable
    % Preferable - Base class for mixins that indicate an array of class
    %   objects may be sorted by some type of preferability
    %
    %   When a mixin class subclasses Preferable, it should call the
    %   addPreferabilityComparator method in its constructor and add a
    %   function that accepts two objects and returns a negative value,
    %   zero, or positive value if the first object is less than, equal to,
    %   or greater than the second object.
    %
    %   Note: one or both objects passed to the comparator may not derive 
    %   from the mixin class.
    
    % Copyright 2020 The MathWorks, Inc.
    
    properties (Access = private)
        PreferabilityComparators
    end
    
    methods (Sealed)
        function sorted = sortByPreferability(array)
            map = mergeMaps({array.PreferabilityComparators});
            sorted = insertionSort(array, @(a,b)chainedComparator(a,b,map.values));
        end
    end
    
    methods (Hidden, Access = protected)
        function obj = Preferable()
            if isempty(obj.PreferabilityComparators)
                obj.PreferabilityComparators = containers.Map();
            end
        end
        
        function obj = addPreferabilityComparator(obj, mixinClass, comparator)
            obj.PreferabilityComparators(mixinClass) = comparator;
        end
    end
end

function sorted = insertionSort(array, comparator)
for i = 2:numel(array)
    key = array(i);
    j = i - 1;
    while j >= 1 && comparator(array(j), key) > 0
        array(j+1) = array(j);
        j = j - 1;
    end
    array(j+1) = key;
end
sorted = array;
end

function p = chainedComparator(a, b, comparators)
for i = 1:numel(comparators)
    compare = comparators{i};
    value = compare(a, b);
    assert(compare(b, a) == -value, 'comparator violates contract!');
    if value ~= 0
        p = value;
        return;
    end
end
p = 0;
end

function m = mergeMaps(maps)
m = containers.Map();
for i = 1:numel(maps)
    map = maps{i};
    keys = map.keys;
    for j = 1:numel(keys)
        m(keys{j}) = map(keys{j});
    end
end
end
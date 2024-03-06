classdef Version
    % Version - A MATLAB-style version
    %
    %   Valid versions take the form XXX.XXX.XXX.XXXXXXXXX, where X may be
    %   a digit only.
    %
    %   Examples of valid versions:
    %
    %       9
    %       9.7
    %       9.7.0.1261785
    %
    %   Examples of invalid versions:
    %
    %       9.1-beta
    %       R2019a
    
    % Copyright 2020-2022 The MathWorks, Inc.
    
    properties (SetAccess = immutable)
        Parts
    end
    
    methods
        function obj = Version(verstr)
            p = sscanf(verstr, '%3d.%3d.%3d.%9d');
            s = strjoin(strtrim(cellstr(num2str(p)))', '.');
            if ~strcmp(s, verstr)
                error('scriptgen:Version:invalidFormat', 'invalid verstr format');
            end
            p(end+1:4) = 0;
            obj.Parts = p(:)';
        end
        
        function t = eq(a, b)
            t = diff(a, b) == 0;
        end
        
        function t = ne(a, b)
            t = diff(a, b) ~= 0;
        end
        
        function t = lt(a, b)
            t = diff(a, b) < 0;
        end
        
        function t = le(a, b)
            t = diff(a, b) <= 0;
        end
        
        function t = gt(a, b)
            t = diff(a, b) > 0;
        end
        
        function t = ge(a, b)
            t = diff(a, b) >= 0;
        end
    end
    
    methods (Access = private)        
        function d = diff(a, b)
            if ~isa(a, 'scriptgen.internal.Version') || ~isa(b, 'scriptgen.internal.Version')
                error('incompatible types');
            end
            d = a.num - b.num;
        end
        
        function n = num(obj)
            n = arrayfun(@(v)str2double(sprintf('%03d%03d%03d%09d', v.Parts)), obj);
        end
    end
    
    properties (Access = private, Constant)
        ReleaseVersions = map( ...
            'R2022b', '9.13', ...
            'R2022a', '9.12', ...
            'R2021b', '9.11', ...
            'R2021a', '9.10', ...
            'R2020b', '9.9', ...
            'R2020a', '9.8', ...
            'R2019b', '9.7', ...
            'R2019a', '9.6', ...
            'R2018b', '9.5', ...
            'R2018a', '9.4', ...
            'R2017b', '9.3', ...
            'R2017a', '9.2', ...
            'R2016b', '9.1', ...
            'R2016a', '9.0', ...
            'R2015b', '8.6', ...
            'R2015a', '8.5', ...
            'R2014b', '8.4', ...
            'R2014a', '8.3', ...
            'R2013b', '8.2', ...
            'R2013a', '8.1');
    end
    
    methods (Static)
        function v = forRelease(release)
            r = scriptgen.internal.Version.ReleaseVersions;
            if ~r.isKey(release)
                error('scriptgen:Version:unknownRelease', 'unknown release');
            end
            v = scriptgen.internal.Version(r(release));
        end
        
        function v = forCurrentRelease()
            s = strsplit(version());
            v = scriptgen.internal.Version(s{1});
        end
    end
end

function m = map(varargin)
m = containers.Map();
for i = 1:2:numel(varargin)
    m(varargin{i}) = varargin{i+1};
end
end
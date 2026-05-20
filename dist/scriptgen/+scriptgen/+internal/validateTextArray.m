function validateTextArray(value)
% Copyright 2020 The MathWorks, Inc.
if ~iscellstr(value) || ~(isempty(value) || isvector(value)) %#ok<ISCLSTR>
    error('MATLAB:invalidType', 'Expected input to be cellstr vector');
end
end


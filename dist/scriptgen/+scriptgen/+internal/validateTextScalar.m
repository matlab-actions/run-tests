function validateTextScalar(value)
% Copyright 2020 The MathWorks, Inc.
if isempty(value) && ischar(value)
    return;
end
validateattributes(value, {'char'}, {'vector'});
end


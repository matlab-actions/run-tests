function validateVerbosityScalar(value)
% Copyright 2022 The MathWorks, Inc.
if ischar(value)
    scriptgen.internal.validateTextScalar(value);
else
    validateattributes(value, {'numeric'}, {'scalar'});
end
end


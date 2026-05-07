function validateText(value)
% Copyright 2020 The MathWorks, Inc.
if ischar(value)
    scriptgen.internal.validateTextScalar(value);
else
    scriptgen.internal.validateTextArray(value);
end
end


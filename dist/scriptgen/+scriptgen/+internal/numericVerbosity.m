function n = numericVerbosity(verbosity)
% Copyright 2022 The MathWorks, Inc.
if isnumeric(verbosity)
    n = verbosity;
elseif strcmpi(verbosity, 'none')
    n = 0;
elseif strcmpi(verbosity, 'terse')
    n = 1;
elseif strcmpi(verbosity, 'concise')
    n = 2;
elseif strcmpi(verbosity, 'detailed')
    n = 3;
elseif strcmpi(verbosity, 'verbose')
    n = 4;
else
    warning('scriptgen:numericVerbosity:unknownVerbosity', ...
        'Unknown verbosity level. Defaulting to maximum verbosity.');
    n = 4;
end
end
function script = genscript(type, varargin)
% genscript - Generates a script
%
%   The genscript function provides a convenient way to generate a pre-made
%   script object.
%
%   SCRIPT = genscript(TYPE) generates and returns a script of TYPE. TYPE
%   must be a character vector and match the name of a script builder 
%   located in the scriptgen.scripts package.
%
%   SCRIPT = genscript(TYPE, NAME, VALUE, ...) generates and returns a
%   script of TYPE setting those name-value pairs on the script builder.
%
%   Examples:
%
%       testScript = genscript('Test', 'JUnitTestResults', 'results.xml');
%       writeToFile(testScript, 'myscript.m');

% Copyright 2020 The MathWorks, Inc.

import scriptgen.CodeProvider;

provider = CodeProvider.default();
script = provider.createScript(type, varargin{:});
end


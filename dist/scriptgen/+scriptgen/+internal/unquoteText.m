function u = unquoteText(text)
% Copyright 2020 The MathWorks, Inc.
s = regexp(text, '^''', 'once');
e = regexp(text, '''$', 'once');
if isempty(s) || isempty(e)
    u = text;
else
    u = text(s+1:e-1);
end
end


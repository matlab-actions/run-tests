function tf = isAbsolutePath(p)
if ispc()
    tf = ~isempty(regexp(p, '^.:', 'once')) || strncmp(p, '\\', 2);
else
    tf = any(strncmp(p, {'/', '~'}, 1));
end
end


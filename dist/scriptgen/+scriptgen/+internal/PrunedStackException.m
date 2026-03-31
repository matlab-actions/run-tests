classdef PrunedStackException < MException
    %  Copyright 2020 MathWorks, Inc.
    
    properties(SetAccess=immutable, GetAccess=protected)
        PrunedStack
    end
    
    methods
        function pruned = PrunedStackException(other, frameToPrune)
            if nargin < 2
                % If no frame is specified, prune the frame of the caller
                s = dbstack('-completenames');
                if numel(s) > 1
                    frameToPrune = rmfield(s(2), 'line');
                else
                    frameToPrune = struct('file', {});
                end
            end
            
            pruned = pruned@MException(other.identifier, '%s', other.message);
            if isprop(pruned, 'type') && isprop(other, 'type')
                pruned.type = other.type;
            end
            for idx = 1:numel(other.cause)
                pruned = pruned.addCause(scriptgen.internal.PrunedStackException(other.cause{idx}, frameToPrune));
            end
            
            stack = other.getStack();
            remove = ismember({stack.file}, {frameToPrune.file});
            if isfield(frameToPrune, 'name')
                remove = ismember({stack.name}, {frameToPrune.name}) & remove;
            end
            if isfield(frameToPrune, 'line')
                remove = ismember([stack.line], [frameToPrune.line]) & remove;
            end
            stack(remove) = [];
            
            pruned.PrunedStack = stack;
        end
    end
    
    methods(Access=protected)
        function stack = getStack(pruned)
            stack = pruned.PrunedStack;
        end
    end
end



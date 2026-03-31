classdef Script < scriptgen.Code
    % Script - A collection of statements organized in to sequences
    
    % Copyright 2020 The MathWorks, Inc.
    
    properties (SetAccess = immutable)
        Sequences
    end
    
    methods
        function obj = Script(sequences)
            import scriptgen.Sequence;
            
            if iscellstr(sequences) || (ischar(sequences) && isvector(sequences)) %#ok<ISCLSTR>
                sequences = Sequence(sequences);
            end
            
            validateattributes(sequences, {'scriptgen.Sequence'}, {'vector'});
            
            obj.Sequences = sequences;
        end
        
        function file = writeToFile(obj, file)
            import scriptgen.FileOutput;
            [~,~] = mkdir(fileparts(file));
            stream = FileOutput(file);
            obj.writeToStream(stream);
        end
        
        function text = writeToText(obj)
            % DEPRECATED - Use the Contents property
            text = obj.Contents;
        end
        
        function run(obj)
            % RUN - Run script
            %
            %   RUN(SCRIPT) runs the code contents of the SCRIPT in the callers
            %   workspace as if it were executed from a script file on disk.
            %
            %   This method is roughly equivalent to writing the contents of the
            %   SCRIPT to a file in the current working directory and executing 
            %   the file by typing its name.
            
            tempFolder = tempname();
            [~, name] = fileparts(tempFolder);
            scriptName = ['tempscript_' name(end-3:end)];
            scriptPath = fullfile(tempFolder, [scriptName '.m']);
            
            obj.writeToFile(scriptPath);
            oldPath = addpath(tempFolder);
            
            restoreState = onCleanup(@()cleanup(oldPath, tempFolder));
            function cleanup(p, f)
                path(p);
                rmdir(f, 's');
            end
            
            try
                evalin('caller', strcat(scriptName, ';'));
            catch e
                throw(scriptgen.internal.PrunedStackException(e));
            end
        end
    end
    
    methods (Access={?scriptgen.CodeWriter, ?scriptgen.Code})
        function write(obj, writer)
            import scriptgen.Sequence;
            import scriptgen.Statement;
            
            imports = sort(unique([obj.Sequences.RequiredImports]));
            if ~isempty(imports)
                importText = cellfun(@(i)sprintf('import %s;', i), imports, 'UniformOutput', false);
                writer.writeSequence(Sequence(importText));
            end
            
            for sequence = obj.Sequences
                writer.writeSequence(sequence);
            end
        end
    end
end
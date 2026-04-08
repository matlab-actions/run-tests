classdef CodeProvider < handle
    % CodeProvider - Provider of immutable code objects
    %
    %   The scriptgen.CodeProvider class serves as the primary interface
    %   for creating pre-made code objects. To create code objects the
    %   CodeProvider utilizes builders under the following packages:
    %
    %       scriptgen.expressions   - Expression builders
    %       scriptgen.scripts       - Script builders
    %       scriptgen.sequences     - Sequence builders
    %       scriptgen.statements    - Statement builders
    %
    %   To locate a builder, the CodeProvider relies on the builder's class
    %   name. For example, when called to create a Script of type 'Test', 
    %   the CodeProvider will look for a Script builder under
    %   scriptgen.scripts with the class name 'TestScriptBuilder'. It will
    %   then utilize an internal implementation of that builder to create
    %   the requested Script object.
    %
    %   Builders may also exist under subpackages. To access builders under 
    %   subpackages, a new CodeProvider must be instantiated with the 
    %   subpackage name. The withSubpackage method is a convenience for
    %   instantiating new providers off an existing provider.
    
    % Copyright 2020 The MathWorks, Inc.
    
    properties (SetAccess = private)
        Subpackage
    end
    
    properties (Access = private)
        ExpressionBuilderFactory
        StatementBuilderFactory
        SequenceBuilderFactory
        ScriptBuilderFactory
    end
    
    methods
        function obj = CodeProvider(subpackage)
            import scriptgen.internal.validateTextScalar;
            
            if nargin < 1
                subpackage = '';
            end
            validateTextScalar(subpackage);
            
            obj.ExpressionBuilderFactory = obj.createFactory('expressions', subpackage);
            obj.StatementBuilderFactory = obj.createFactory('statements', subpackage);
            obj.SequenceBuilderFactory = obj.createFactory('sequences', subpackage);
            obj.ScriptBuilderFactory = obj.createFactory('scripts', subpackage);
            
            obj.Subpackage = subpackage;
        end
        
        function expression = createExpression(obj, type, varargin)
            type = appendSuffix(type, 'ExpressionBuilder');
            expression = obj.createCode(obj.ExpressionBuilderFactory, type, varargin{:});
        end
        
        function statement = createStatement(obj, type, varargin)
            type = appendSuffix(type, 'StatementBuilder');
            statement = obj.createCode(obj.StatementBuilderFactory, type, varargin{:});
        end
        
        function sequence = createSequence(obj, type, varargin)
            type = appendSuffix(type, 'SequenceBuilder');
            sequence = obj.createCode(obj.SequenceBuilderFactory, type, varargin{:});
        end
        
        function script = createScript(obj, type, varargin)
            type = appendSuffix(type, 'ScriptBuilder');
            script = obj.createCode(obj.ScriptBuilderFactory, type, varargin{:});
        end
        
        function provider = withSubpackage(obj, subpackage)
            import scriptgen.CodeProvider;
            
            sub = pkgjoin({obj.Subpackage, subpackage});
            provider = CodeProvider(sub);
        end
    end
    
    methods (Access = private)
        function factory = createFactory(~, type, subpackage)
            import scriptgen.internal.CodeBuilderLocator;
            import scriptgen.internal.CodeBuilderFactory;
            
            implPackage = pkgjoin({'scriptgen.internal', type, subpackage});
            intfPackage = pkgjoin({'scriptgen', type, subpackage});
            
            locator = CodeBuilderLocator(implPackage, intfPackage);
            factory = CodeBuilderFactory(locator);
        end
        
        function code = createCode(~, factory, type, varargin)
            builder = factory.create(type);
            if isempty(builder)
                code = scriptgen.internal.MissingCode.empty();
                return;
            end
            if ~isempty(varargin)
                set(builder, varargin{:});
            end
            code = builder.build();
        end
    end
    
    methods (Static)
        function provider = default()
            persistent singleton;
            if isempty(singleton)
                singleton = scriptgen.CodeProvider();
            end
            provider = singleton;
        end
    end
end

function name = appendSuffix(name, suffix)
if isempty(regexp(name, ['\w*' suffix '$'], 'once'))
    name = [name suffix];
end
end

function p = pkgjoin(names)
tf = cellfun(@(n)~isempty(n), names);
p = strjoin(names(tf), '.');
end
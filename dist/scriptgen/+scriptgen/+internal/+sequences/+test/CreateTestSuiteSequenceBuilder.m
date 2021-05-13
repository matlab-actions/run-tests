classdef CreateTestSuiteSequenceBuilder < scriptgen.sequences.test.CreateTestSuiteSequenceBuilder ...
        & scriptgen.internal.mixin.VersionDependent
    % Copyright 2020 The MathWorks, Inc.
    
    properties (Constant, Access = protected)
        MinSupportedVersion = scriptgen.internal.Version.forRelease('R2013a')
    end
    
    methods
        function sequence = build(obj)
            import scriptgen.Sequence;
            
            testCodeProvider = obj.CodeProvider.withSubpackage('test');
            
            statements = testCodeProvider.createStatement('CreateTestSuite', ...
                'SuiteName', obj.SuiteName);
            
            if ~isempty(obj.SelectByFolder)
                statements(end+1) = obj.buildSelectorStatement(testCodeProvider, 'base folder selector', ...
                    'CreateHasBaseFolderSelector', 'BaseFolder', obj.SelectByFolder);
            end
            
            if ~isempty(obj.SelectByTag)
                statements(end+1) = obj.buildSelectorStatement(testCodeProvider, 'tag selector', ...
                    'CreateHasTagSelector', 'Tag', obj.SelectByTag);
            end
            
            sequence = Sequence(statements);
        end
    end
    
    methods (Access = private)
        function [statement, success] = buildSelectorStatement(obj, provider, name, type, varargin)
            import scriptgen.Statement;
            
            statement = obj.buildSelectIfStatement(provider.createExpression(type, varargin{:}));
            if isempty(statement)
                success = false;
                msg = ['Unable to create ' name '. This problem might be due to a MATLAB release ' ...
                    'or operating system that does not support generating the specified artifact, ' ...
                    'a missing toolbox, or a missing license.'];
                statement = Statement(['% ' msg]);
                warning('scriptgen:selector:featureNotAvailable', msg);
                return;
            end
            
            success = true;
        end
        
        function statement = buildSelectIfStatement(obj, expression)
            import scriptgen.Statement;
            
            if isempty(expression)
                statement = Statement.empty();
                return;
            end
            statement = Statement(sprintf('%s = %s.selectIf(%s);', obj.SuiteName, obj.SuiteName, expression.Text), expression.RequiredImports);
        end
    end
end


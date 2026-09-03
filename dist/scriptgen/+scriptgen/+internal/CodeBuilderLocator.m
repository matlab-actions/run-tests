classdef CodeBuilderLocator
    % CodeBuilderLocator - Locator of CodeBuilder metaclasses
    
    % Copyright 2020 The MathWorks, Inc.
    
    properties (Dependent, Access = private)
        ImplementationPackage
        InterfacePackage
    end
    
    properties (Access = private)
        ImplementationPackageName
        InterfacePackageName
    end
    
    methods
        function obj = CodeBuilderLocator(implPackage, intfPackage)
            if ~ischar(implPackage) || ~ischar(intfPackage)
                error('Packages must be provided as character arrays');
            end
            obj.ImplementationPackageName = implPackage;
            obj.InterfacePackageName = intfPackage;
        end
        
        function p = get.ImplementationPackage(obj)
            p = meta.package.fromName(obj.ImplementationPackageName);
        end
        
        function p = get.InterfacePackage(obj)
            p = meta.package.fromName(obj.InterfacePackageName);
        end
        
        function metaclasses = locate(obj, type)
            if ischar(type)
                type = prependPrefix([obj.InterfacePackage.Name '.'], type);
                type = meta.class.fromName(type);
            end
            if isempty(type)
                metaclasses = type;
                return;
            end
            classes = obj.ImplementationPackage.ClassList;
            classes = classes(classes <= type);
            classes = classes(~[classes.Abstract]);
            metaclasses = classes;
        end
    end
end

function name = prependPrefix(prefix, name)
    if isempty(regexp(name, ['^' prefix '\w*'], 'once'))
        name = [prefix name];
    end
end


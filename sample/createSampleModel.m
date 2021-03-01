function createSampleModel(model)
    % Create model
   open_system(new_system(model));
    % add blocks
    add_block('built-in/Inport', [model, '/InputPort'], ...
     'Position', [50 50 100 100]);
    add_block('built-in/Gain', [model, '/Gain'], 'Gain', '1', ...
       'Position', [150 50 200 100]);
    add_block('built-in/Outport', [model, '/OutputPort'], ...
    'Position', [250 50 300 100]);
    % add lines
    add_line(model, 'InputPort/1', 'Gain/1');
    add_line(model, 'Gain/1', 'OutputPort/1');
    % save system
    save_system(model);
    close_system(model);
end

ECS.System("inputhandler",
{
    init: function(state)
    {
        var input = state.systems.inputhandler;
        input.moveaxis = [0, 0];
        input.keysdown = {};
        ECS.Events.handle('keyreleased', function(keymap)
        {
            input.keysdown[keymap] = false;
        });
        ECS.Events.handle('keypressed', function(keymap)
        {
            input.keysdown[keymap] = true;
        });
    },
    
    update: function(state, dt)
    {
        var input = state.systems.inputhandler;
        var entities = ECS.Entities.get(ECS.Components.Transform, ECS.Components.Player);
        var e;
        input.moveaxis = [0, 0];
        var key = input.keysdown;
        while(e = entities.next())
        {
            if (key[state.keys.down])
            {
                input.moveaxis[1] += 1;
            } 
            
            if (key[state.keys.up])
            {
                input.moveaxis[1] -= 1;
            } 
            
            if (key[state.keys.left])
            {
                input.moveaxis[0] -= 1;
            } 
            
            if (key[state.keys.right])
            {
                input.moveaxis[0] += 1;
            } 
            e.getTransform().position[0] += input.moveaxis[0];
            e.getTransform().position[1] += input.moveaxis[1];
        }
        input.moveaxis = [0, 0];
    }
});

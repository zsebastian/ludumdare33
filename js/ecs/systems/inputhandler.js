ECS.System("inputhandler",
{
    order: 0,

    init: function(state)
    {
        var input = state.systems.inputhandler;
        input.axis = [0, 0];
        input.axisSpeed = 1;
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
        var entities = ECS.Entities.get(ECS.Components.Movement, ECS.Tags.Player);
        var e;
        var tempAxis = [0, 0];
        var key = input.keysdown;
        while(e = entities.next())
        {
            var movement = e.getMovement();
            movement.isMoving = false;
            if (key[state.keys.down])
            {
                tempAxis[1] += 1;
                movement.isMoving = true;
            } 
            
            if (key[state.keys.up])
            {
                tempAxis[1] -= 1;
                movement.isMoving = true;
            } 
            
            if (key[state.keys.left])
            {
                tempAxis[0] -= 1;
                movement.isMoving = true;
            } 
            
            if (key[state.keys.right])
            {
                tempAxis[0] += 1;
                movement.isMoving = true;
            } 
            tempAxis = Util.Vector.normalized(tempAxis);
            var acc = input.axisSpeed * dt * movement.acceleration;
            movement.velocity[0] += tempAxis[0] * acc;
            movement.velocity[1] += tempAxis[1] * acc;
            movement.velocity = 
                Util.Vector.clampMagnitude(
                    movement.velocity, 0, movement.maxVelocity);
        }
    }
});

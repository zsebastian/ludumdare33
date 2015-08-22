ECS.System("inputhandler",
{
    order: 0,

    init: function(state)
    {
        var input = state.systems.inputhandler;
        input.axis = [0, 0];
        input.axisAcc = 25;
        input.keysdown = {};
        input.dashTime = 0;
        input.player = null;
        ECS.Events.handle('keyreleased', function(keymap)
        {
            input.keysdown[keymap] = false;
            if (keymap == state.keys.dash)
            {
                if (input.player != null)
                {
                    ECS.Events.emit('dash', input.player, input.dashTime);
                }
                input.dashTime = 0;
            }
        });
        ECS.Events.handle('keypressed', function(keymap)
        {
            if (keymap == state.keys.dash)
            {
                if (input.player != null)
                {
                     ECS.Events.emit('preparedash', input.player);
                }
                input.dashTime = 0;
            }
            input.keysdown[keymap] = true;
        });
    },
    
    update: function(state, dt)
    {
        var input = state.systems.inputhandler;
        var entities = ECS.Entities.get(ECS.Components.Direction, ECS.Tags.Player);
        var e;
        var tempAxis = [0, 0];
        var key = input.keysdown;
        while(e = entities.next())
        {
            input.player = e;
            var direction = e.getDirection();
            direction.isMoving = false;
            if (key[state.keys.down])
            {
                tempAxis[1] += 1;
                direction.isMoving = true;
            } 
            
            if (key[state.keys.up])
            {
                tempAxis[1] -= 1;
                direction.isMoving = true;
            } 
            
            if (key[state.keys.left])
            {
                tempAxis[0] -= 1;
                direction.isMoving = true;
            } 
            
            if (key[state.keys.right])
            {
                tempAxis[0] += 1;
                direction.isMoving = true;
            } 

            if (direction.isMoving)
            {
                tempAxis = Util.Vector.normalized(tempAxis);
                var acc = input.axisAcc * dt;
                input.axis[0] += tempAxis[0] * acc;
                input.axis[1] += tempAxis[1] * acc;
                direction.direction = Util.Vector.normalized(input.axis);
                input.axis = Util.Vector.clampMagnitude(input.axis, 0, 1);
            }

            direction.isStopping = key[state.keys.still];
            if (key[state.keys.still])
            {
                direction.isMoving = false;
            }

            if (key[state.keys.dash])
            {
                input.dashTime += dt;
                direction.isMoving = false;
            }

        }
    }
});

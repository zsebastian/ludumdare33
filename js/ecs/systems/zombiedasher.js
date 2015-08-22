ECS.System("zombiedasher",
{
    order: 1,

    init: function(state)
    {
        var dasher = state.systems.zombiedasher;
        ECS.Events.handle('dash', function(e, downTime)
        {
            dash = e.getZombieDash();
            if(!dash.inDash)
            {
                dash.direction = e.getDirection().direction;
                dash.prepareToDash = false;
                dash.inDash = true;
                dash.dashProgress = 0;
                dash.power = Math.min(0.25, downTime) + 0.25;
            }
        });
        ECS.Events.handle('preparedash', function(e)
        {
            dash = e.getZombieDash();
            if(!dash.inDash)
            {
                dash.prepareToDash = true;
            }
        });

    },
    
    update: function(state, dt)
    {
        var entities = ECS.Entities.get(ECS.Components.Direction, 
                ECS.Components.ZombieDash, ECS.Components.Transform);
        while(e = entities.next())
        {
            var dash = e.getZombieDash();
            var direction = e.getDirection();
            if (dash.prepareToDash || dash.inDash)
            {
                direction.isMoving = false;
            }

            if (dash.inDash)
            {
                dash.dashProgress += dt;
                if(dash.dashProgress > dash.power)
                {
                    dash.inDash = false;
                    dash.power = 0;
                    dash.prepareToDash = false;
                    dash.dashProgress = 0;
                }
                else
                {
                    var transform = e.getTransform();
                    var movement = e.getMovement();
                    if (movement)
                    {
                        movement.velocity[0] = 0;
                        movement.velocity[1] = 0;
                    }
                    var speed = dt * dash.power * dash.power * dash.speed
                        * ((1 - dash.dashProgress / dash.power) + 1);

                    transform.position[0] += dash.direction[0] * speed;
                    transform.position[1] += dash.direction[1] * speed;
                }
            }
        }
    }
});
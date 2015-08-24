ECS.System("zombiedasher",
{
    order: 1,

    init: function(state)
    {
        var dasher = state.systems.zombiedasher;
        ECS.Events.handle('dash', function(e, downTime)
        {
            dash = e.getZombieDash();
            if(!dash.inDash && dash.prepareToDash)
            {
                dash.direction = e.getDirection().direction;
                dash.prepareToDash = false;
                dash.inDash = true;
                dash.dashProgress = 0;
                dash.power = Math.min(0.25, downTime) + 0.25;
                dash.energy -= dash.power * 2;
            }
        });
        ECS.Events.handle('preparedash', function(e)
        {
            dash = e.getZombieDash();
            if(!dash.inDash && dash.energy > 0)
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
            
            dash.energy += dt;
            if (dash.energy > 1)
            {
                dash.energy = 1;
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

                    var newPos = [0, 0];
                    newPos[0] = transform.position[0] + dash.direction[0] * speed;
                    newPos[1] = transform.position[1] + dash.direction[1] * speed;
                    Util.Collider.tryMove(transform, newPos);
                }
            }
        }
    }
});

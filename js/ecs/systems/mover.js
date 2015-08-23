ECS.System("mover",
{
    order: 4,

    init: function(state)
    {

    },
    
    update: function(state, dt)
    {
        var input = state.systems.inputhandler;
        var entities = ECS.Entities.get(ECS.Components.Transform, 
                ECS.Components.Movement, 
                ECS.Components.Direction);
        var e;
        Util.Collider.useTileMap(state.tilemap);
        while(e = entities.next())
        {
            var transform = e.getTransform();
            var movement = e.getMovement();
            var direction = e.getDirection();
            var velo = movement.velocity;
            var pos = transform.position;
            var len = Util.Vector.magnitude(velo);
            
            if (!direction.isMoving)
            {
                var stopForce = movement.stopForce;
                if (direction.isStopping)
                {
                    stopForce *= 4;
                }
                var sign = [Math.sign(velo[0]), Math.sign(velo[1])];
                var diff = [sign[0] * stopForce * dt,
                    sign[1] * stopForce * dt];

                if (Math.abs(diff[0]) > Math.abs(velo[0]))
                {
                    velo[0] = 0;
                }
                else
                {
                    velo[0] -= diff[0];
                }

                if (Math.abs(diff[1]) > Math.abs(velo[1]))
                {
                    velo[1] = 0;
                }
                else
                {
                    velo[1] -= diff[1];
                }

                var newPos = [0, 0];
                newPos[0] = pos[0] + velo[0] * dt;
                newPos[1] = pos[1] + velo[1] * dt;

                Util.Collider.tryMove(transform, newPos);

                movement.velocity = velo;
            }
            else
            { 
                velo[0] += 
                    movement.acceleration * direction.direction[0] * dt;
                velo[1] += 
                    movement.acceleration * direction.direction[1] * dt;

                var maxVel = movement.maxVelocity;
                if (direction.isSneaking)
                {
                    maxVel *= 0.5;
                }
                velo = 
                    Util.Vector.clampMagnitude(velo, 0, maxVel);

                var newPos = [0, 0];
                newPos[0] = pos[0] + velo[0] * dt;
                newPos[1] = pos[1] + velo[1] * dt;

                Util.Collider.tryMove(transform, newPos);

                movement.velocity = velo;
            }
        }
    }
});

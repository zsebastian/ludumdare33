ECS.System("mover",
{
    order: 4,

    init: function(state)
    {

    },
    
    update: function(state, dt)
    {
        var input = state.systems.inputhandler;
        var entities = ECS.Entities.get(ECS.Components.Transform, ECS.Components.Movement);
        var e;
        var key = input.keysdown;
        while(e = entities.next())
        {
            var transform = e.getTransform();
            var movement = e.getMovement();
            var velo = movement.velocity;
            var pos = transform.position;
            var len = Util.Vector.magnitude(velo);
            if (!movement.isMoving)
            {
                var sign = [Math.sign(velo[0]), Math.sign(velo[1])];
                var diff = [sign[0] * movement.stopForce * dt,
                    sign[1] * movement.stopForce * dt];

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
            }
            pos[0] += velo[0] * dt;
            pos[1] += velo[1] * dt;
        }
    }
});

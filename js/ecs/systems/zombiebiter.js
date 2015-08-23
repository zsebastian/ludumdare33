ECS.System("zombiebiter",
{
    order: 2,

    init: function(state)
    {

    },
    
    update: function(state, dt)
    {
        var entities = ECS.Entities.get(
                ECS.Components.ZombieBite,
                ECS.Components.Transform,
                ECS.Components.Direction);
        while(e = entities.next())
        {
            var bite = e.getZombieBite();
            var transform = e.getTransform();
            var dir = e.getDirection().direction;
            dir = Util.Vector.normalized(dir);
            var upperLeft = [];
            var lowerRight = [];
            var bitePos = [
                transform.position[0] + dir[0] * bite.range,
                transform.position[1] + dir[1] * bite.range];

            upperLeft[0] = bitePos[0] - bite.bounds[0] / 2;
            upperLeft[1] = bitePos[1] - bite.bounds[1] / 2;
            lowerRight[0] = bitePos[0] + bite.bounds[0] / 2;
            lowerRight[1] = bitePos[1] + bite.bounds[1] / 2;

            Util.Collider.findIntersectingTransforms(upperLeft, lowerRight, function(otherT)
                {
                    if (otherT.entityId != e.id)
                    {
                        var other = ECS.Entities.find(otherT.entityId);
                        var health = other.getHealth();
                        if (health)
                        {
                            if (health.blink < 0)
                            {
                                health.blink = 0.1;
                            }
                            health.health -= bite.damage * dt; 
                        }
                    }
                });
            
        }
    }
});
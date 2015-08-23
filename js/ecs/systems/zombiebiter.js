ECS.System("zombiebiter",
{
    order: 2,

    init: function(state)
    {

    },
    
    update: function(state, dt)
    {
        var entities = ECS.Entities.get(ECS.Components.ZombieBite, ECS.Components.Transform);
        while(e = entities.next())
        {
            var bite = e.getZombieBite();
            var transform = e.getTransform();
            var upperLeft = [];
            var lowerRight = [];
            upperLeft[0] = transform.position[0] - transform.bounds[0] - bite.range[0];
            upperLeft[1] = transform.position[1] - transform.bounds[1] - bite.range[1];
            lowerRight[0] = transform.position[0] + transform.bounds[0] + bite.range[0];
            lowerRight[1] = transform.position[1] + transform.bounds[1] + bite.range[1];
            Util.Collider.findIntersectingTransforms(upperLeft, lowerRight, function(otherT)
                {
                    if (otherT.entityId != e.id)
                    {
                        var other = ECS.Entities.find(otherT.entityId);
                        var health = other.getHealth();
                        if (health)
                        {
                            health.health -= bite.damage * dt; 
                        }
                    }
                });
            
        }
    }
});

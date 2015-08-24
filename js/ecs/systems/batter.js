ECS.System("batter",
{
    order: 2,

    init: function(state)
    {

    },
    
    update: function(state, dt)
    {
        var entities = ECS.Entities.get(
                ECS.Components.Bat,
                ECS.Components.Transform,
                ECS.Components.Direction);
        while(e = entities.next())
        {
            var bat = e.getBat();
            var transform = e.getTransform();
            var dir = e.getDirection().direction;
            dir = Util.Vector.normalized(dir);
            var upperLeft = [];
            var lowerRight = [];
            var batPos = [
                transform.position[0] + dir[0] * bat.range,
                transform.position[1] + dir[1] * bat.range];

            upperLeft[0] = batPos[0] - bat.bounds[0] / 2;
            upperLeft[1] = batPos[1] - bat.bounds[1] / 2;
            lowerRight[0] = batPos[0] + bat.bounds[0] / 2;
            lowerRight[1] = batPos[1] + bat.bounds[1] / 2;
            bat.batting -= dt;
            if (bat.batting < 0)
            {
                bat.batting = 0;

                if (bat.target != null)
                {
                    var health = bat.target.getHealth();
                    if (health.blink < 0)
                    {
                        health.blink = 0.1;
                    }
                    health.health -= bat.damage; 
                    bat.target = null;
                }
                Util.Collider.findIntersectingTransforms(upperLeft, lowerRight, function(otherT)
                {
                    if (otherT.entityId != e.id && (bat.batting <= 0))
                    {
                        var other = ECS.Entities.find(otherT.entityId);
                        var team = other.getTeam();
                        var myTeam = e.getTeam();
                        var health = other.getHealth();
                        if (health)
                        {
                            if (myTeam && team &&
                                myTeam.team == team.team)
                            {
                                return;
                            }
                            bat.target = other;
                            bat.batting = 0.2;
                        }
                    }
                });
            }
        }
    }
});

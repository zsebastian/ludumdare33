ECS.System("deathculler",
{
    order: 9,

    init: function(state)
    {

    },
    
    update: function(state, dt)
    {
        var entities = ECS.Entities.get(ECS.Components.Health);
        var e;
        var toCull = [];
        while(e = entities.next())
        {
            if (e.getHealth().health <= 0)
            {
               toCull.push(e); 
            }
        }
        for (var i = 0; i < toCull.length; ++i)
        {
            ECS.Entities.destroy(toCull[i]);
        }
    }
});

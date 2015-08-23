ECS.System("aicontroller", (function() {

    states = {};
    states.idling = function(state, entity, dt)
    {
        var ai = entity.getAI();
        var test = Math.random() * ai.timeInCurrentState;
        if (Math.random() * ai.timeInCurrentState > 5)
        {
            ai.timeInCurrentState = 0;
            ai.currentState = 'patroling';
            var pos =  entity.getTransform().position;
            
            var targetPosition = [pos[0] + (Math.random() - 0.5) * ai.aiConfig.patrolRange, 
                pos[1] + (Math.random() - 0.5) * ai.aiConfig.patrolRange];
            ai.currentTargetPosition = targetPosition;
        }
    };

    states.patroling = function(state, entity, dt)
    {
        var ai = entity.getAI();
        var dir = 
            [ai.currentTargetPosition[0] - entity.getTransform().position[0],
            ai.currentTargetPosition[1] - entity.getTransform().position[1]];
        if (Util.Vector.magnitudeSquared(dir) < 0.5 || ai.timeInCurrentState > 2)
        {
            ai.currentState = 'idling';
            ai.timeInCurrentState = 0;
        }
        dir = Util.Vector.normalized(dir);
        entity.getDirection().direction = dir;
        entity.getDirection().isMoving = true;
    }
    
    return {
        order: 0,

        init: function(state)
        {

        },
        
        update: function(state, dt)
        {
            var ai = state.systems.ai;
            var entities = ECS.Entities.get(ECS.Components.Direction, ECS.Components.AI);
            while(e = entities.next())
            {
                e.getAI().timeInCurrentState += dt;
                states[e.getAI().currentState](state, e, dt);
            }
        },
    }
})());

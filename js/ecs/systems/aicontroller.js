ECS.System("aicontroller", (function() {

    states = {};
    states.idling = function(state, entity, dt)
    {
        var ai = entity.getAI();
        entity.getDirection().isMoving = false;
        if (Math.random() * ai.timeInCurrentState > 2)
        {
            ai.timeInCurrentState = 0;
            ai.currentState = 'patrolling';
            var pos =  entity.getTransform().position;
            
            var targetPosition = [pos[0] + (Math.random() - 0.5) * ai.aiConfig.patrolRange, 
                pos[1] + (Math.random() - 0.5) * ai.aiConfig.patrolRange];
            ai.currentTargetPosition = targetPosition;
        }
    };

    states.batting = function(state, entity, dt)
    {
        var bat = entity.getBat();
        var ai = entity.getAI();
        entity.getDirection().isMoving = false;
        entity.getMovement().velocity = [0, 0];
        if(bat.batting < 0)
        {
            ai.currentState = 'idling';
            ai.timeInCurrentState = 0;
        }
    }

    states.chasing = function(state, entity, dt)
    {
        var ai = entity.getAI();
        if (ai.currentTarget == null ||
            Math.random() * ai.timeInCurrentState > 4)
        {
            ai.currentState = 'idling';
            ai.timeInCurrentState = 0;
        }
        var targetPos = ai.currentTarget.getTransform().position;
        var dir = 
            [targetPos[0] - entity.getTransform().position[0],
            targetPos[1] - entity.getTransform().position[1]];

        
        dir = Util.Vector.normalized(dir);
        entity.getDirection().direction = dir;
        entity.getDirection().isMoving = true;
    }

    states.patrolling = function(state, entity, dt)
    {
        var ai = entity.getAI();
        var dir = 
            [ai.currentTargetPosition[0] - entity.getTransform().position[0],
            ai.currentTargetPosition[1] - entity.getTransform().position[1]];

        if (Util.Vector.magnitude(dir) < 0.1 || 
                    ai.timeInCurrentState > 5)
        {
            ai.currentState = 'idling';
            ai.timeInCurrentState = 0;
        }
        else
        {
            dir = Util.Vector.normalized(dir);
            entity.getDirection().direction = dir;
            entity.getDirection().isMoving = true;
        }
    }

    var findTarget = function(e)
    {
        var dir = e.getDirection().direction;
        var pos = e.getTransform().position;
        var upperLeft = [];
        var lowerRight = [];
        var bounds = e.getAI().aiConfig.observant;
        x0 = pos[0] - bounds / 2 + ((bounds / 2) * dir[0]);
        y0 = pos[1] - bounds / 2 + ((bounds / 2) * dir[1]);
        x1 = pos[0] + bounds / 2 + ((bounds / 2) * dir[0]);
        y1 = pos[1] + bounds / 2 + ((bounds / 2) * dir[1]);
        upperLeft = [Math.min(x0, x1), Math.min(y0, y1)];
        lowerRight = [Math.max(x0, x1), Math.max(y0, y1)];

        Util.Collider.findIntersectingTransforms(upperLeft, lowerRight, function(otherT)
        {
            if (otherT.entityId != e.id &&
                e.getAI().currentTarget == null)
            {
                var other = ECS.Entities.find(otherT.entityId);
                var team = other.getTeam();
                var myTeam = e.getTeam();
                if (myTeam && team &&
                    myTeam.team != team.team)
                {
                    var ai = e.getAI();
                    ai.currentTarget = other;
                    ai.currentState = 'chasing';
                    ai.timeInCurrentState = 0;
                }
            }
        });
        
    }

    return {
        order: 0,

        init: function(state)
        {
            ECS.Events.handle("tilemapcollision", function(transform)
            {
                var e = ECS.Entities.find(transform.entityId);
                var ai = e.getAI();
                if (ai)
                {
                    if (ai.currentState == 'patrolling')
                    {
                        ai.currentState = 'idling';
                        ai.timeInCurrentState = 0;
                        ai.currentTargetPosition = e.getTransform().position;
                    }
                }
            });

            ECS.Events.handle("entitydestroyed", function(entity)
            {
                var entities = ECS.Entities.get(ECS.Components.AI);
                var e;
                while(e = entities.next())
                {
                    var ai = e.getAI();
                    if (ai.currentState == 'chasing' &&
                        ai.currentTarget.id == entity.id)
                    {
                        ai.currentTarget = null;
                        ai.currentState = 'idling';
                        ai.nextLookout = Math.random() * ai.aiConfig.unobservantFactor;
                    }
                }
            });
        },
        
        update: function(state, dt)
        {
            var entities = ECS.Entities.get(ECS.Components.Direction, ECS.Components.AI);
            var e;
        
            while(e = entities.next())
            {
                var bat = e.getBat();
                var move = e.getMovement();
                var ai = e.getAI();
                ai.nextLookout -= dt;
                if (ai.nextLookout < 0)
                {
                    findTarget(e);
                    ai.nextLookout = Math.random() * ai.aiConfig.unobservantFactor;
                }
                if(bat && bat.batting > 0)
                {
                    ai.currentState = 'batting';
                }
                ai.timeInCurrentState += dt;
                states[ai.currentState](state, e, dt);
            }
        },
    }
})());

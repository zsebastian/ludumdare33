ECS.System("animate", (function() {
    var animateEntity = function(state, e, dt) {
        var sprite = e.getSprite();
        var animation = e.getAnimation();
        var movement = e.getMovement();
        var direction = e.getDirection();
        var dash = e.getZombieDash();
        var col = findColumn(state, direction);
        var bat = e.getBat();
        if (col)
        {
            sprite.mirror = col[1];
            sprite.texCoord[0] = (animation.spriteOffset[0] + col[0]) * 16;
        }

        sprite.currentCardinality = state.newCardinality;
        if (bat && bat.batting > 0)
        {
            sprite.texCoord[1] = 5;
        }
        else if (dash && (dash.prepareToDash || dash.inDash))
        {
            animateDash(state, sprite, animation, dash, dt);
        }
        else if (movement && direction && direction.isMoving)
        {
            moveAnimation(state, sprite, animation, movement, dt);
        }
        else
        {
            animation.idling += dt * Math.random();
            var idleFrame = 0;

            if (animation.idling > 0.8)
            {
                idleFrame = 1 + animation.idleDir;
            }
            if (animation.idling > 1.0)
            {
                if (Math.random() < 0.5)
                {
                    animation.idleDir = 0;
                }
                else
                {
                    animation.idleDir = 1;
                }
                animation.idling -= 1.0;
                idleFrame = 0;
            }
            sprite.texCoord[1] = (idleFrame + animation.spriteOffset[1]) * 16;

        }
    }

    var animateDash = function(state, sprite, animation, dash, dt) {
        var frame = 0;
        if (dash.prepareToDash)
        {
            frame = 5;
        }
        else if (dash.inDash)
        {
            var prog = dash.dashProgress / dash.power;
            frame = 6;
            if (prog > 0.45)
            {
               frame = 7;
            } 
            if (prog > 0.90)
            {
               frame = 5;
            } 
        }

        sprite.texCoord[1] = (animation.spriteOffset[1] + (frame)) * 16;

    }

    var moveAnimation = function(state, sprite, animation, movement, dt) {
        if (state.isMoving != movement.isMoving)
        {
            animation.currentFrameTime = 0;
            animation.currentFrame = 0;
        }
        state.isMoving = movement.isMoving;
        if (state.newCardinality != state.currentCardinality)
        {

        }
        animation.currentFrameTime += Util.Vector.magnitude(movement.velocity) * dt;
        if (animation.currentFrameTime > 5.0)
        {
            animation.currentFrame = (animation.currentFrame + 1) % 4;
            animation.currentFrameTime -= 5.0;
        }
        var frame;
        if (animation.currentFrame == 0)
        {
            frame = 3;
        }
        else if (animation.currentFrame == 1)
        {
            frame = 0;
        }
        else if (animation.currentFrame == 2)
        {
            frame = 4; 
        }
        else if (animation.currentFrame == 3)
        {
            frame = 0; 
        }
        sprite.texCoord[1] = (animation.spriteOffset[1] + (frame)) * 16;

    }

    var findColumn = function(state, direction) {
        if (direction)
        {
            var cardinality = '';
            var tolerance = 0.33;
            dir = direction.direction;
            if (dir[1] > tolerance)
            {
                cardinality += 's';
            }
            if (dir[1] < -tolerance)
            {
                cardinality += 'n';
            }
            if (dir[0] > tolerance)
            {
                cardinality += 'e';
            }
            if (dir[0] < -tolerance)
            {
                cardinality += 'w';
            }
            state.newCardinality = cardinality;
            return state.cardinality[cardinality];
        }
        return null;
    }

    return {
        order: 9,

        init: function(state) {

            state.cardinality = {
                's': [0, false],
                'se': [1, false],
                'e': [2, false],
                'ne': [3, false],
                'n': [4, false],
                'nw': [3, true],
                'w': [2, true],
                'sw': [1, true]
            };
        },
        
        update: function(state, dt) {
            var entities = ECS.Entities.get(ECS.Components.Sprite, ECS.Components.Animation);
            var ctx = state.systems.spriterenderer.ctx;
            var e;
            while(e = entities.next())
            {
                animateEntity(state, e, dt);
            }
        }
    }
})() );

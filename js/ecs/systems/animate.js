ECS.System("animate", (function() {
    var animateEntity = function(state, e, dt) {
        var sprite = e.getSprite();
        var animation = e.getAnimation();
        var movement = e.getMovement();
        var col = findColumn(state, e.getMovement());
        if (col)
        {
            sprite.mirror = col[1];
            sprite.texCoord[0] = col[0] * 16;
        }

        sprite.currentCardinality = state.newCardinality;
        if (movement && movement.isMoving)
        {
            return moveAnimation(state, sprite, animation, movement, dt);
        }
        else
        {
            sprite.texCoord[1] = 0;
        }
    }

    var moveAnimation = function(state, sprite, animation, movement, dt) {
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
            frame = 1;
        }
        else if (animation.currentFrame == 1)
        {
            frame = 0;
        }
        else if (animation.currentFrame == 2)
        {
            frame = 2; 
        }
        else if (animation.currentFrame == 3)
        {
            frame = 0; 
        }
        sprite.texCoord[1] = (frame) * 16;

    }

    var findColumn = function(state, movement) {
        if (movement)
        {
            var cardinality = '';
            var tolerance = 0.33;
            var dir = Util.Vector.clampMagnitude(movement.velocity, 0, 1);
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

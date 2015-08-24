ECS.System("spriterenderer",
{
    order: 10,

    init: function(state)
    {
        state.systems.spriterenderer.canvas = state.canvas;
        state.systems.spriterenderer.ctx = canvas.getContext('2d');
        state.systems.spriterenderer.maptiles = state.resource('img/maptiles.png');
        state.systems.spriterenderer.camera = null;
        state.systems.spriterenderer.cameraVelo = [0, 0];
    },
    
    update: function(state, dt)
    {
        var entities = ECS.Entities.get(ECS.Components.Sprite, ECS.Components.Transform);
        var ctx = state.systems.spriterenderer.ctx;
        var canvas = state.systems.spriterenderer.canvas;
        var e;
        var player = ECS.Entities.get(ECS.Tags.Player).next();
        var tilemap = state.tilemap;
        var maptiles = state.systems.spriterenderer.maptiles;
        var camera = state.systems.spriterenderer.camera;
        var cameraVelo = state.systems.spriterenderer.cameraVelo;
        if (player)
        {
            var pos = player.getTransform().position;
            var dir = player.getDirection().direction;
            if (!camera)
            {
                camera = [pos[0], pos[1]];
            }
            var free = 20;
            var diff = [0, 0];
            diff[0] = pos[0] - camera[0] + dir[0] * free;
            diff[1] = pos[1] - camera[1] + dir[1] * free;
            var len = Util.Vector.magnitude(diff);
            diff = Util.Vector.normalized(diff);
            var k = 4;
            cameraVelo[0] = diff[0] * (len) * k;
            cameraVelo[1] = diff[1] * (len ) * k;
            camera[0] += cameraVelo[0] * dt; 
            camera[1] += cameraVelo[1] * dt; 

            state.systems.spriterenderer.camera = camera;
        }
        if (!camera)
        {
            return;
        }
        camera = [camera[0], camera[1]];
        if (camera[0] < canvas.width / 8)
        {
            camera[0] = canvas.width / 8;
        }
        if (camera[1] < canvas.height / 8)
        {
            camera[1] = canvas.height / 8;
        }
        if (camera[0] > tilemap.w * tilemap.tilesize - canvas.width / 8)
        {
            camera[0] = tilemap.w * tilemap.tilesize - canvas.width / 8;
        }
        if (camera[1] > tilemap.h * tilemap.tilesize - canvas.height / 8)
        {
            camera[1] = tilemap.h * tilemap.tilesize - canvas.height / 8;
        }

        ctx.save();
        
        ctx.translate(-(camera[0] - (state.canvasSize[0] / 2)), 
                -(camera[1] - (state.canvasSize[1] / 2)));

        camera0 = [camera[0] - state.canvasSize[0] / 2, 
            camera[1] - state.canvasSize[1] / 2];

        camera1 = [camera[0] + state.canvasSize[0] / 2, 
            camera[1] + state.canvasSize[1] / 2];

        pos0 = tilemap.getTileFromWorld(camera0);
        pos1 = tilemap.getTileFromWorld(camera1);
       
        for(var x = pos0[0]; x <= pos1[0]; ++x)
        {
            for(var y = pos0[1]; y <= pos1[1]; ++y)
            {
                var val = tilemap.get([x, y]);
                
                ctx.drawImage(maptiles,
                    (val[0] * tilemap.tilesize), 
                    (val[1] * tilemap.tilesize),
                    tilemap.tilesize, tilemap.tilesize,
                    x * tilemap.tilesize - 0.5, y * tilemap.tilesize - 0.5,
                    tilemap.tilesize + 1, tilemap.tilesize + 1);
            }
        }

        var renderList = [];
        while(e = entities.next())
        {
            renderList.push(e);
        }
        renderList = renderList.sort(function (a, b) {
            return a.getTransform().position[1] -
                b.getTransform().position[1];
        });

        for (var i = 0; i < renderList.length; ++i)
        {
            e = renderList[i];
            var sprite = e.getSprite();
            var transform = e.getTransform();
            var position = transform.position;
            var yOffset = 0;
            var health = e.getHealth();

            //This does not belong here;
            var dash = e.getZombieDash();
            ctx.save();
            if (health)
            {
                if (health.blink > -1)
                {
                    health.blink -= dt;
                    if (health.blink > 0)
                    {
                        ctx.globalAlpha = 0.1;
                    }
                }
            }

            if (dash && dash.inDash)
            {
                yOffset = dash.dashProgress / dash.power;
                yOffset -= 0.5;
                yOffset *= 2;
                yOffset = -(-yOffset * yOffset + 1);
                yOffset *= 5;
            }
            yOffset -= 6;
            // The scale seems to mess the tex coords up?
            // The tile above tends to get rendered a lot.
            // Move the coords and the size a little tighter.
            if (sprite.mirror)
            {
                ctx.save();
                ctx.scale(-1,1);
                ctx.drawImage(sprite.img,
                    sprite.texCoord[0], sprite.texCoord[1] + 0.5,
                    sprite.size[0] - 0.5, sprite.size[1] - 1,

                    -1 * (position[0]) - sprite.size[0] / 2,
                    position[1] - sprite.size[1] / 2 + yOffset,

                    sprite.size[0], sprite.size[1]);
                ctx.restore();
            }
            else
            {
                ctx.drawImage(sprite.img,
                    Math.ceil(sprite.texCoord[0]) , Math.ceil(sprite.texCoord[1] + 0.5) ,
                    sprite.size[0] - 1, sprite.size[1] - 1,

                    position[0] - sprite.size[0] / 2, 
                    position[1] - sprite.size[1] / 2 + yOffset,

                    sprite.size[0], sprite.size[1]);
            }

            var health = e.getHealth();
            if (health)
            {
                var barW = 10;
                var barH = 2;
                var offset = -3;
                ctx.fillStyle = 'rgba(255, 0, 0, 64)';
                ctx.fillRect(
                    position[0] - barW / 2 + 1, 
                    position[1] - barH / 2 - offset,
                    barW - 2,
                    barH);
                ctx.fillStyle = 'rgba(127, 0, 0, 64)';
                ctx.fillRect(
                    position[0] - barW / 2 + 0.5,
                    position[1] - barH / 4 - offset,
                    (health.health / health.maxHealth) * barW - 1,
                    barH / 2);
            }

            var dash = e.getZombieDash();
            if (dash)
            {
                var energy = dash.energy;
                var barW = 10;
                var barH = 2;
                var offset = -5;
                ctx.fillStyle = 'rgba(0, 0, 255, 64)';
                ctx.fillRect(
                    position[0] - barW / 2 + 1, 
                    position[1] - barH / 2 - offset,
                    barW - 2,
                    barH);
                ctx.fillStyle = 'rgba(0, 0, 127, 64)';
                ctx.fillRect(
                    position[0] - barW / 2 + 0.5, 
                    position[1] - barH / 4 - offset,
                    (energy / 1) * barW - 1,
                    barH / 2);
            }
            
            ctx.restore();
        }
        ctx.restore();
    }
});

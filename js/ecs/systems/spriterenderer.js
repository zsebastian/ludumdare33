ECS.System("spriterenderer",
{
    order: 10,

    init: function(state)
    {
        state.systems.spriterenderer.canvas = state.canvas;
        state.systems.spriterenderer.ctx = canvas.getContext('2d');
        state.systems.spriterenderer.maptiles = state.resource('img/maptiles.png');
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
        var camera = player.getTransform().position;
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
            var position = e.getTransform().position; 
            var yOffset = 0;

            //This does not belong here;
            var dash = e.getZombieDash();

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
        }
        ctx.restore();
    }
});

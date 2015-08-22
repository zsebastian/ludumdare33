ECS.System("spriterenderer",
{
    order: 10,

    init: function(state)
    {
        state.systems.spriterenderer.canvas = state.canvas;
        state.systems.spriterenderer.ctx = canvas.getContext('2d');
    },
    
    update: function(state, dt)
    {
        var entities = ECS.Entities.get(ECS.Components.Sprite, ECS.Components.Transform);
        var ctx = state.systems.spriterenderer.ctx;
        var e;
        while(e = entities.next())
        {
            var sprite = e.getSprite();
            var position = e.getTransform().position; 
            // The scale seems to mess the tex coords up?
            // The tile above tends to get rendered a lot.
            // Move the coords and the size a little tighter.
            if (sprite.mirror)
            {
                ctx.save();
                ctx.scale(-1,1);
                ctx.drawImage(sprite.img,
                    sprite.texCoord[0] + 0.5, sprite.texCoord[1] + 0.5,
                    sprite.size[0] - 1, sprite.size[1] - 1,
                    -1 * (position[0]) - sprite.size[0] / 2, position[1] - sprite.size[1] / 2,
                    sprite.size[0], sprite.size[1]);
                ctx.restore(); 
            }
            else
            {
                ctx.drawImage(sprite.img,
                    sprite.texCoord[0] + 0.5, sprite.texCoord[1] + 0.5,
                    sprite.size[0] - 1, sprite.size[1] - 1,
                    position[0] - sprite.size[0] / 2, position[1] - sprite.size[1] / 2,
                    sprite.size[0], sprite.size[1]);

            }
        }
    }
});

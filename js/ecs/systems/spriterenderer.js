ECS.System("spriterenderer",
{
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
            ctx.drawImage(sprite.img,
                sprite.texCoord[0], sprite.texCoord[1],
                sprite.size[0], sprite.size[1],
                position[0] - sprite.size[0] * 2, position[1] - sprite.size[1] * 2,
                sprite.size[0] * 4, sprite.size[1] * 4);
        }
    }
});

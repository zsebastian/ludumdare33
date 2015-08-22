ECS.System("spriterenderer",
{
    init: function(state)
    {
        state.systems.spriterenderer.canvas = state.canvas;
        state.systems.spriterenderer.ctx = canvas.getContext('2d');
        console.log("init");
    },
    
    update: function(state, dt)
    {
    }
});

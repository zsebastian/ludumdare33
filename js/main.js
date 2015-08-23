var resourcesToLoad=[
    'img/tiles.png'
]

var canvas = null;
var ctx = null;
var lastTime = null;

var keys = 
{
    down: 0,
    left: 1,
    right: 2,
    up: 3,
    dash: 4,
    still: 5,
}
var keyMapping = 
{
    40: keys.down,
    37: keys.left,
    39: keys.right,
    38: keys.up,
    32: keys.dash,
    16: keys.still,
    87: keys.up,
    83: keys.down,
    65: keys.left,
    68: keys.right
}

$(document).ready(function () {
    canvas = document.createElement("canvas");
    ctx = canvas.getContext('2d');
    canvas.width = 480;
    canvas.height = 360;
    state.canvas = canvas;
    state.keys = keys;
    state.tilemap = new Util.Tilemap(64, 64);

    document.body.appendChild(canvas);
    
    window.resources.onReady(init);
    window.resources.load(resourcesToLoad);

});

keysDown = {}
keysDownOld = {}

function handleKeys()
{
    for (var index in keysDown)
    {
        var keymap = keyMapping[index];
        if (keymap == undefined)
        {
            keymap = index;
        }
        if (keysDown[index] && !keysDownOld[index])
        {
            handleKeyPress(keymap); 
        }
        if (!keysDown[index] && keysDownOld[index])
        {
            handleKeyRelease(keymap);
        }
        keysDownOld[index] = keysDown[index];
    }
}

function handleKeyRelease(keymap)
{
    ECS.Events.emit('keyreleased', keymap);
}

function handleKeyPress(keymap)
{
    ECS.Events.emit('keypressed', keymap);
}

var state = {};

function init() {
    var tiles = window.resources.get('img/tiles.png');
    lastTime = Date.now();
    var e = ECS.Entities.create().
        setPlayer().
        addTransform([32, 16]).
        addSprite(tiles, [16, 16], [0, 0]).
        addMovement(25, 80, 100).
        addAnimation([0, 0]).
        addDirection().
        addZombieDash(250);
    
    e.print();

    state.resource = window.resources.get;

    document.addEventListener('keydown', function(event) 
    {
        keysDown[event.keyCode] = true;
    });

    document.addEventListener('keyup', function(event)
    {
        keysDown[event.keyCode] = false;
    });

    ECS.init(state);
    main();
}

function main() 
{
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;

    clearColor();
    ctx.save();
    ctx.scale(4, 4);
    state.canvasSize = [canvas.width / 4, canvas.height / 4];
    update(dt);
    ctx.restore();

    lastTime = now;
    requestAnimFrame(main);
};

function update(dt) 
{
    handleKeys();
    ECS.update(state, dt);
}

function clearColor() 
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

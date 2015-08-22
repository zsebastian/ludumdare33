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
    walk: 6
}
var keyMapping = 
{
    40: keys.down,
    37: keys.left,
    39: keys.right,
    38: keys.up,
    32: keys.dash,
    16: keys.still,
    17: keys.walk
}

$(document).ready(function () {
    canvas = document.createElement("canvas");
    ctx = canvas.getContext('2d');
    canvas.width = 480;
    canvas.height = 360;
    state.canvas = canvas;
    state.keys = keys;

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
    var e = ECS.Entities.add().
        has(ECS.Components.Transform.make([32, 16])).
        has(ECS.Components.Sprite.make(tiles, [16, 16], [0, 0]));
    
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
    update(dt);

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

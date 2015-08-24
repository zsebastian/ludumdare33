var resourcesToLoad=[
    'img/chars.png',
    'img/maptiles.png'
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
    restart: 6
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
    68: keys.right,
    82: keys.restart
}

$(document).ready(function () {
    canvas = document.createElement("canvas");
    ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 480;
    state.canvas = canvas;
    state.keys = keys;
    var tm = new Util.Tilemap(32, 32);

    state.tilemap = tm;

    document.body.appendChild(canvas);
    
    window.resources.onReady(init);
    window.resources.load(resourcesToLoad);

});

keysDown = {}
keysDownOld = {}

function plotBuilding(tiles)
{
    var w = Math.floor(random(1, 4));
    var h = Math.floor(random(1, 4))
    var x = Math.floor(random(0, tiles.w - w + 1));
    var y = Math.floor(random(0, tiles.h - h + 1))

    var bw = (w / 2) << 0;
    var bh = (h / 2) << 0;
    var taken = false;

    for (var j = x - bw - 1; j <= x + bw + 1; ++j)
    {
        for (var i = y - bh - 1; i <= y + bh + 1; ++i)
        {
            if(tiles.isSolid([i, j]) && tiles.inMap([i, j]))
            {
                taken = true;
            }
        }
    }

    if (!taken)
    {
        for (var j = x - bw; j <= x + bw; ++j)
        {
            for (var i = y - bh; i <= y + bh; ++i)
            {
                tiles.set([i, j], [0, 1]);
            }
        }
    }
}

function handleKeys()
{
    for (var index in keysDown)
    {
        var keymap = keyMapping[index];
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
    if (keymap == keys.restart)
    {
        keysDown = {};
        init();
        return;
    }
    ECS.Events.emit('keypressed', keymap);
}

var state = {};

function spawnPlayer(chars, bounds)
{
    Util.Factory.player(chars, randomPositionOnMap(bounds)); 
}

function spawnEnemy(chars, bounds)
{
    Util.Factory.batGuy(chars, randomPositionOnMap(bounds)); 
}

function randomPositionOnMap(bounds)
{
    var bounds = [7, 5];

    var w = state.tilemap.w * state.tilemap.tilesize;
    var h = state.tilemap.h * state.tilemap.tilesize;
    var x = random(bounds[0], w - bounds[0])
    var y = random(bounds[1], h - bounds[1])
    while(state.tilemap.collides([x, y], bounds))
    {
        x = random(bounds[0], w - bounds[0])
        y = random(bounds[1], h - bounds[1])
    }

    return [x, y];
}

function random(min, max)
{
    return Math.random() * (max - min) + min;
}

function init() {
    var chars = window.resources.get('img/chars.png');
    var maptiles = window.resources.get('img/maptiles.png');
    state.resource = window.resources.get;
    ECS.init(state);
    
    for (var i = 0; i < 4; ++i)
    {
        plotBuilding(state.tilemap);
    }

    spawnPlayer(chars);
    for (var i = 0; i < 32; ++i)
    {
        spawnEnemy(chars, [7, 5]);
    }

    document.addEventListener('keydown', function(event) 
    {
        if (keyMapping[event.keyCode] != undefined)
        {
            event.preventDefault();
            keysDown[event.keyCode] = true;
        }
    });

    document.addEventListener('keyup', function(event)
    {
        if (keyMapping[event.keyCode] != undefined)
        {
            event.preventDefault();
            keysDown[event.keyCode] = false;
        }
    });
    lastTime = Date.now();
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

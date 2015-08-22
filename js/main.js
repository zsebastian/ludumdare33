var resourcesToLoad=[
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
    document.body.appendChild(canvas);
    
    window.resources.onReady(init);
    window.resources.load(resourcesToLoad);

    document.addEventListener('keydown', function(event) 
    {
        keysDown[event.keyCode] = true;
    });

    document.addEventListener('keyup', function(event)
    {
        keysDown[event.keyCode] = false;
    });
});

keysDown = {}
keysDownOld = {}

function handleKeys(dt)
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
            handleKeyPress(keymap, dt); 
        }
        if (keysDown[index])
        {
            handleKeyDown(keymap, dt); 
        }
        if (!keysDown[index] && keysDownOld[index])
        {
            handleKeyRelease(keymap, dt);
        }
        keysDownOld[index] = keysDown[index];
    }
}

function handleKeyDown(keymap, dt)
{

}

function handleKeyRelease(keymap, dt)
{

}

function handleKeyPress(keymap, dt)
{

}

function init() {
    lastTime = Date.now();
    main();
}

function main() 
{
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;

    update(dt);
    render();

    lastTime = now;
    requestAnimFrame(main);
};

function update(dt) 
{
    handleKeys(dt);
}

function render() {

}

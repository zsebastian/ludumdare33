var canvas = null;
var ctx = null;
var lastTime = null;

$(document).ready(function () {
    state = states.modify;
    console.log(res);
    session = res.session;
    map = common.serializeMap(res.map.tiles);
    level = res.level;
    canvas = document.createElement("canvas");
    ctx = canvas.getContext('2d');
    var size = common.getMapSize(map);
    canvas.width = size[1] * tileSize;
    canvas.height = size[0] * tileSize + 12 * 1.5;
    document.body.appendChild(canvas);
    resources.load(resourcesToLoad);
    resources.onReady(init);

    document.addEventListener('keydown', function(event) {
        handleKeyDown(event.keyCode);
    });
});

function handleKeyDown(keycode)
{

}

function init() {
    lastTime = Date.now();
    main();
}

function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;

    if (state == states.modify || 
        state == states.move)
    {
        if (canvas && map)
        {
            update(dt);
            render();
        }
    }

    lastTime = now;
    requestAnimFrame(main);
};

function update(dt) {

}

function render() {

}

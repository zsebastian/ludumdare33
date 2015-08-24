Util.Tilemap = function Tilemap(w, h, tilesize) {
    this.map = new Int32Array(w * h);
    this.w = w;
    this.h = h;
    this.tilesize = tilesize || 16;
    return this;
} 

Util.Tilemap.prototype.get = function(pos)
{
    return this.getTileVector(this.map[this.getIndexFor(pos)]);
}

Util.Tilemap.prototype.set = function(pos, value)
{
    this.map[this.getIndexFor(pos)] = this.fromTileVector(value);
}

Util.Tilemap.prototype.isSolid = function(pos)
{
    if (!this.inMap(pos))
    {
        return true;
    }
    var tileVal = this.get(pos);
    return tileVal[1] == 1;
} 

Util.Tilemap.prototype.collides = function(pos, bounds)
{
    var upperLeft = this.getTileFromWorld([pos[0] - bounds[0], pos[1] - bounds[1]]);
    var lowerRight = this.getTileFromWorld([pos[0] + bounds[0], pos[1] + bounds[1]]);
    for (var x = upperLeft[0]; x <= lowerRight[0]; ++x)
    {
        for (var y = upperLeft[1]; y <= lowerRight[1]; ++y)
        {
            if (this.isSolid([x, y]))
            {
                return true;
            }
        }
    }
    return false;
}

Util.Tilemap.prototype.getTileVector = function(val)
{
    var y = val >> 16;
    var x = val & 0x00ff; 
    return [x, y];
}

Util.Tilemap.prototype.fromTileVector = function(tile)
{
    var ypart = tile[1] << 16;
    var ret = ypart | tile[0];
    return ret;
}

Util.Tilemap.prototype.getIndexFor = function(pos)
{
    return pos[0] + pos[1] * this.w; 
}

Util.Tilemap.prototype.inMap = function(pos)
{
    return !(pos[0] >= this.w ||
        pos[0] < 0 ||
        pos[1] >= this.h ||
        pos[1] < 0)
}

Util.Tilemap.prototype.getTileFromWorld = function(pos)
{
    var x = (pos[0] / this.tilesize) << 0;
    var y = (pos[1] / this.tilesize) << 0;
    if (x >= this.w)
    {
        x = this.w - 1;
    }
    if (x < 0)
    {
        x = 0;
    }
    if (y >= this.h)
    {
        y = this.h - 1;
    }
    if (y < 0)
    {
        y = 0;
    }

    return [x, y]; 
}

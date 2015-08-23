Util.Tilemap = function Tilemap(w, h, tilesize) {
    this.map = new Int32Array(w * h);
    this.w = w;
    this.h = h;
    this.tilesize = tilesize || 16;
    return this;
} 

Util.Tilemap.prototype.get = function(pos)
{
    return this.map[this.getIndexFor(pos)];
}

Util.Tilemap.prototype.set = function(pos, value)
{
    this.map[this.getIndexFor(pos)] = value;
}

Util.Tilemap.prototype.getIndexFor = function(pos)
{
    return pos.x + pos.y * this.w; 
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
        x = this.h - 1;
    }
    if (x < 0)
    {
        x = 0;
    }

    return [x, y]; 
}

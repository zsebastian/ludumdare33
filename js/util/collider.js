Util.Collider = (function() {
    var tilemap;
    var cells = {};

    ECS.Events.handle("entitycreated", function(entity)
    {
        var transform = entity.getTransform();
        if (transform)
        {
            addToCell(transform);
        }
    });

    ECS.Events.handle("entitydestroyed", function(entity)
    {
        var transform = entity.getTransform();
        if (transform)
        {
            removeFromCell(transform);
        }
    });
    
    var toCell = function(pos)
    {
        return cell = [pos[0] >> 6, pos[1] >> 6];
    }

    var transformsInCell = function(cell)
    {
        var key = cell[0] + ',' + cell[1];
        return cells[key];
    }

    var removeFromCell = function(transform)
    {
        if (transform.cell)
        {
            delete cells[transform.cell][transform.entityId];
        }
    }

    var addToCell = function(transform)
    {
        var pos = transform.position;
        var cell = toCell(pos);
        var key = cell[0] + ',' + cell[1];
        transform.cell = key;

        if (!cells[key])
        {
            cells[key] = {};
        }

        cells[key][transform.entityId] = transform;
    }
    return {

        useTileMap: function(theTilemap) {
            tilemap = theTilemap
        },


        // returns a position between from and to
        // that does not intersect with a solid tile
        // in the tilemap.
        tryMove: function(transform, to) {
            var from = transform.position;
            var bound = transform.bounds;
            var tilesize = tilemap.tilesize;
            var ret = [to[0], to[1]];
            var diff = [to[0] - from[0], to[1] - from[1]];
            var tile = [(to[0] / tilesize) << 0, (to[1] / tilemap.tilesize) << 0];
            var next = [tile[0] + Math.sign(diff[0]), tile[1] + Math.sign(diff[1])];
            if (eid =- undefined)
            {
                throw 'what';
            }


            if (diff[0] < 0)
            {
                tile = [(ret[0] / tilesize) << 0, (ret[1] / tilemap.tilesize) << 0];
                var left = [tile[0] - 1, tile[1]];
                if (tilemap.isSolid(left) && ret[0] - bound[0] < left[0] * tilesize + tilesize)
                {
                    ret[0] = left[0] * tilesize + tilesize + bound[0];
                }
            } 
            else if (diff[0] > 0)
            {
                tile = [(ret[0] / tilesize) << 0, (ret[1] / tilemap.tilesize) << 0];
                var right = [tile[0] + 1, tile[1]];
                if (tilemap.isSolid(right) && ret[0] + bound[0] > right[0] * tilesize)
                {
                    ret[0] = right[0] * tilesize - bound[0];
                }
            }

            diff = [ret[0] - from[0], ret[1] - from[1]];
            tile = [(ret[0] / tilesize) << 0, (ret[1] / tilemap.tilesize) << 0];
            next = [tile[0] + Math.sign(diff[0]), tile[1] + Math.sign(diff[1])];
            
            if (diff[1] < 0)
            {
                tile = [(ret[0] / tilesize) << 0, (ret[1] / tilemap.tilesize) << 0];
                var up = [tile[0], tile[1] - 1];
                if (tilemap.isSolid(up) && ret[1] - bound[1] < up[1] * tilesize + tilesize)
                {
                    ret[1] = up[1] * tilesize + tilesize + bound[1];
                }
            } 
            else if (diff[1] > 0)
            {
                tile = [(ret[0] / tilesize) << 0, (ret[1] / tilemap.tilesize) << 0];
                var down = [tile[0], tile[1] + 1];
                if (tilemap.isSolid(down) && ret[1] + bound[1] > down[1] * tilesize)
                {
                    ret[1] = down[1] * tilesize - bound[1];
                }
            }
            
            var oldCell = toCell(from);
            var newCell = toCell(ret);
            if (oldCell[0] != newCell[0] || 
                oldCell[1] != newCell[1])
            {
                removeFromCell(transform);
                transform.position = ret;
                addToCell(transform);
            }
            else
            {
                transform.position = ret;
            }
        },

        findIntersectingTransforms: function(upperLeft, lowerRight, callback)
        {
            var boundingCell0 = toCell(upperLeft);
            var boundingCell1 = toCell(lowerRight);

            for(var x = boundingCell0[0]; x <= boundingCell1[0]; ++x)
            {
                for(var y = boundingCell0[1]; y <= boundingCell1[1]; ++y)
                {
                    var ts = transformsInCell([x, y]);
                    if (ts)
                    {
                        for(var key in ts)
                        {
                            var t = ts[key];
                            if (t)
                            {
                                if (t.position[0] - t.bounds[0] > upperLeft[0] &&
                                    t.position[0] + t.bounds[0] < lowerRight[0] &&
                                    t.position[1] - t.bounds[1] > upperLeft[1] &&
                                    t.position[1] + t.bounds[1] < lowerRight[1])
                                {
                                    callback(t);
                                }
                            }
                        }
                    }
                }
            }
        }
        
    }

})();

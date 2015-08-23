Util.Collider = (function() {
    var tilemap;

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
                while (tilemap.isSolid(left) && ret[0] - bound[0] < left[0] * tilesize + tilesize)
                {
                    ret[0] = left[0] * tilesize + tilesize + bound[0];
                    tile = [(ret[0] / tilesize) << 0, (ret[1] / tilemap.tilesize) << 0];
                    var left = [tile[0] - 1, tile[1]];
                }
            } 
            else if (diff[0] > 0)
            {
                tile = [(ret[0] / tilesize) << 0, (ret[1] / tilemap.tilesize) << 0];
                var right = [tile[0] + 1, tile[1]];
                while (tilemap.isSolid(right) && ret[0] + bound[0] > right[0] * tilesize)
                {
                    ret[0] = right[0] * tilesize - bound[0];
                    tile = [(ret[0] / tilesize) << 0, (ret[1] / tilemap.tilesize) << 0];
                    var right = [tile[0] + 1, tile[1]];
                }
            }

            diff = [ret[0] - from[0], ret[1] - from[1]];
            tile = [(ret[0] / tilesize) << 0, (ret[1] / tilemap.tilesize) << 0];
            next = [tile[0] + Math.sign(diff[0]), tile[1] + Math.sign(diff[1])];
            
            if (diff[1] < 0)
            {
                tile = [(ret[0] / tilesize) << 0, (ret[1] / tilemap.tilesize) << 0];
                var up = [tile[0], tile[1] - 1];
                while (tilemap.isSolid(up) && ret[1] - bound[1] < up[1] * tilesize + tilesize)
                {
                    ret[1] = up[1] * tilesize + tilesize + bound[1];
                    tile = [(ret[0] / tilesize) << 0, (ret[1] / tilemap.tilesize) << 0];
                    var up = [tile[0], tile[1] - 1];
                }
            } 
            else if (diff[1] > 0)
            {
                tile = [(ret[0] / tilesize) << 0, (ret[1] / tilemap.tilesize) << 0];
                var down = [tile[0], tile[1] + 1];
                while (tilemap.isSolid(down) && ret[1] + bound[1] > down[1] * tilesize)
                {
                    ret[1] = down[1] * tilesize - bound[1];
                    tile = [(ret[0] / tilesize) << 0, (ret[1] / tilemap.tilesize) << 0];
                    var down = [tile[0], tile[1] + 1];
                }
            }
            
            transform.position = ret;
        },

        findIntersectingTransforms: function(upperLeft, lowerRight, callback)
        {
            var entities = ECS.Entities.get(ECS.Components.Transform);
            var e;

            while(e = entities.next())
            {
                var t = e.getTransform();
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

})();

ECS.Component("Transform", function (ret, position, bounds)
{
    ret.position = position || [0, 0];
    ret.bounds = bounds || [7, 5];
});

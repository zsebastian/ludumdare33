ECS.Component("Direction", function (ret, direction)
{
    ret.isMoving = false;
    ret.direction = direction || 
        [(Math.random() * 2) - 1,
        (Math.random() * 2) - 1];
    ret.isStopping = false;
});

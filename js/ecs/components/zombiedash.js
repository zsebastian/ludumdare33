ECS.Component("ZombieDash", function (ret, speed)
{
    ret.inDash = false;
    ret.dashProgress = 0;
    ret.power = 0;
    ret.prepareToDash = false;
    ret.direction = [0, 0];
    ret.speed = speed;
});

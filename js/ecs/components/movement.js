ECS.Component("Movement", function (ret, maxVelocity, acceleration, stopForce)
{
    ret.velocity = [0, 0];
    ret.maxVelocity = maxVelocity;
    ret.acceleration = acceleration;
    ret.stopForce = stopForce;
    ret.isMoving = false
});

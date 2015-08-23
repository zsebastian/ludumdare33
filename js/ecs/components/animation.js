ECS.Component("Animation", function (ret, spriteOffset)
{
    ret.currentState = 'standing';
    ret.currentFrame = 0;
    ret.currentFrameTime = 0;
    ret.currentCardinality;
    ret.spriteOffset = spriteOffset;
    ret.idling = 0;
    ret.idleDir = 0;
});

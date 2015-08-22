ECS.Component("Animation", function (ret, moveAnimationSpriteOffset)
{
    ret.moveAnimation = moveAnimationSpriteOffset;
    ret.currentState = 'standing';
    ret.currentFrame = 0;
    ret.currentFrameTime = 0;
    ret.currentCardinality;
});

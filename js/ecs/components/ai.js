ECS.Component("AI", function (ret, aiconfig)
{
    ret.aiConfig = aiconfig;
    ret.currentState = 'idling';
    ret.timeInCurrentState = 2;
    ret.currentTarget = null;
    ret.currentTargetPosition = [0, 0];
});

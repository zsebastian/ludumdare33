ECS.registerComponent("Transform", function (ret, position)
{
    ret.position = position || [0, 0];
});

ECS.registerComponent("Transform", function (ret, position)
{
    for(var i = 0; i < arguments.length; ++i)
    {
        console.log(arguments[i]); 
    }
    console.log(arguments);
    ret.position = position || [0, 0];
});

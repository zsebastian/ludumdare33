ECS.Events = (function() {
    
    var handlers = {}
    var handlerCbs = {}

    return 
    {
        handle: function(eventName, handler)
        {
            if (!handlers[eventName])
            {
                handlers[eventName] = function()
                {
                    for(var i = 0; i < handlerCbs[eventName].length; ++i)
                    {
                        handlerCbs[i](arguments);   
                    }
                } 
                handlerCbs[eventName] = [];
            }
            handlersCbs[eventName].push(handler);
        }

        emit: function(eventName)
        {
            if (handlers[eventName])
            {
               handlers[eventName].apply(null, [].slice.call(arguments, 1));
            } 
        } 
    }
});

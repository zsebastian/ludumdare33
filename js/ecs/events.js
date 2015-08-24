ECS.Events = (function() {
    
    var handlers = {};
    var handlerCbs = {};

    return {
        clear: function()
        {
            handlers = [];
            handerCbs = [];
        },
        handle: function(eventName, handler)
        {
            if (!handlers[eventName])
            {
                handlers[eventName] = function()
                {
                    var handler = handlerCbs[eventName];
                    for(var i = 0; i < handler.length; ++i)
                    {
                        handler[i].apply(null, arguments);   
                    }
                } 
                handlerCbs[eventName] = [];
            }
            handlerCbs[eventName].push(handler);
        },

        emit: function(eventName)
        {
            if (handlers[eventName])
            {
                var args = new Array(arguments.length - 1);
                for (var i = 0; i < args.length; ++i)
                {
                    args[i] = arguments[i + 1];
                }
                handlers[eventName].apply(this, args);
            } 
        }
    };
})();

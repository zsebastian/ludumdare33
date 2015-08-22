ECS = {};
ECS.Components = {};
ECS.Entities = {};


(function()
{
    var nextId = 0;

    var entities = [];

    ECS.Entities.add = function(entity)
    {
        if (!entity)
        {
            entity = new ECS.Entity();
        }
        entities.push(entity); 
        return entity;
    }

    ECS.Entities.get = function ()
    {
        return (function() 
        {
            var i = 0;
            var current = null;
            var ret = {};
            ret.next = function()
            {
                for(; i < entities.length; ++i)
                {
                    if (entities[i].match.apply(entities[i], arguments))
                    {
                        current = entities[i];
                        ++i;
                        return current;
                    }
                }
                current = null;
                return current;
            }
            return ret;
        })(); 
    }

    ECS.registeredComponents = nextId;

    ECS.registerComponent = function(name, constructor)
    {
        console.log("register component: ", name);
        var id = nextId++;
        ECS.registeredComponents = nextId;
        ECS.Components[name] = {};
        ECS.Components[name].name = name;
        ECS.Components[name].familyId = id; 
        ECS.Components[name].make = function()
        {
            var ret = {};
            ret.name = name;
            ret.familyId = id;
            var args = new Array(arguments.length + 1);
            args[0] = ret;
            for(var i = 1; i < args.length; ++i)
            {
                args[i] = arguments[i - 1];
            }

            constructor.apply(null, args);
            return ret;
        }
    }

    ECS.registerTag = function()
    {
        console.log("register tag: ", name);
        var id = nextId++;
        ECS.Tags[name] = {};
        ECS.Tags[name].name = name;
        ECS.Tags[name].familyId = id; 
        ECS.Tags[name].make = function()
        {
            var ret = {};
            ret.name = name;
            ret.familyId = id;
            return ret;
        }
    }

    var systems = [];
    //ECS.System is used to register systems.
    //
    //Systems must define the following:
    //  .update(state, dt)
    //      updates the system
    //
    //  .init(state);
    //      used to initiate the system.
    //
    //  .name is added to the object upon registering.
    //      state-object that is passed to every function 
    //      will have a .system[name]-object that can be 
    //      used by the system for whatever. This can be 
    //      used instead of storing data locally.
    //
    //
    //  In order to listen to events the system may call:
    //      ECS.handle('nameOfEvent', function(state, args...){})
    //  To emit an event the system may call:
    //      ECS.emit('nameOfEvent', state, args...);
    //
    ECS.System = (function(){
        return function(name, obj)
        {
            console.log("register ", name);
            obj.name = name;
            systems.push(obj);
        }
    })();

    ECS.init = (function(state)
    {
        systems.sort(function(a, b){
            return a.order - b.order;
        });
        state.systems = {};
        for(var i = 0; i < systems.length; ++i)
        {
            var system = systems[i];
            state.systems[system.name] = {};
            system.init(state);
        }
    });

    ECS.update = (function(state, delta)
    {
        for(var i = 0; i < systems.length; ++i)
        {
            systems[i].update(state, delta);
        }
    });
})();

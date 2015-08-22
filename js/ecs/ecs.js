ECS = {};
ECS.Components = {};

(function()
{
    var nextId = 0;

    var entities = [];

    ECS.addEntity = function(Entity entity)
    {
        entities.push(entity); 
    }

    ECS.getEntities = function* (){
    {
        for(int i = 0; i < entities.length; ++i)
        {
            if (entities[i].match(arguments))
            {
                yield entities[i]; 
            }
        }
    }

    ECS.registerComponent = (function(){
        return function(name, constructor)
        {
            console.log("register ", name);
            var id = nextId++;
            ECS.Components[name] = {};
            ECS.Components[name].name = name;
            ECS.Components[name].id = id; 
            ECS.Components[name].make = function()
            {
                var ret = {};
                ret.name = name;
                ret.id = id;
                constructor.apply(null, [ret, arguments]);
                return ret;
            }
        }
    })();

    ECS.registerTag = (function(){
        return function(name)
        {
            console.log("register ", name);
            var id = nextId++;
            ECS.Tags[name] = {};
            ECS.Tags[name].name = name;
            ECS.Tags[name].familyId = id; 
            ECS.Tags[name].make = function()
            {
                var ret = {};
                ret.name = name;
                ret.id = id;
                return ret;
            }
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

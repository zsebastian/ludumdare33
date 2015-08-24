ECS = {};
ECS.Components = {};
ECS.Tags = {};
ECS.Entities = {};


(function()
{
    var nextId = 0;

    var entities = []; 
    var systems = [];

    ECS.Entities.create = function(entity)
    {
        if (!entity)
        {
            entity = new ECS.Entity();
        }
        entities.push(entity); 
        ECS.Events.emit("entitycreated", entity);
        return entity;
    }

    ECS.Entities.destroy = function(entity)
    {
        for (var i = 0; i < entities.length; ++i)
        {
            if (entities[i].id == entity.id)
            {
                ECS.Events.emit("entitydestroyed", entities[i]);
                entities.splice(i, 1);
                return;
            }
        }
    }

    ECS.Entities.find = function(id)
    {
        for (var i = 0; i < entities.length; ++i)
        {
            if (entities[i].id == id)
            {
                return entities[i]; 
            }
        }
    }

    ECS.Entities.get = function ()
    {
        var key = new Array(arguments.length);
        for (var i = 0; i < key.length; ++i)
        {
            key[i] = arguments[i];
        }
        return (function() 
        {
            var i = 0;
            var current = null;
            var ret = {};
            ret.next = function()
            {
                for(; i < entities.length; ++i)
                {
                    if (entities[i].match.apply(entities[i], key))
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

    ECS.Component = function(name, constructor)
    {
        console.log("register component: ", name);
        var id = nextId++;
        ECS.registeredComponents = nextId;
        ECS.Components[name] = {};
        ECS.Components[name].name = name;
        ECS.Components[name].familyId = id; 

        ECS.Entity.prototype['add' + name] = function()
        {
            var component = {};
            component.name = name;
            component.familyId = id;
            var args = new Array(arguments.length + 1);
            args[0] = component;
            for(var i = 1; i < args.length; ++i)
            {
                args[i] = arguments[i - 1];
            }

            constructor.apply(null, args);

            this.data[id] = component;
            this['get' + name] = function(){ return component; };
            this['has' + name] = function(){ return true; }
            component.entityId = this.id;
            return this;
        };
        
        ECS.Entity.prototype['has' + name] = function(){ return false; }
        ECS.Entity.prototype['get' + name] = function(){ return null; }

    }

    ECS.Tag = function(name)
    {
        console.log("register tag: ", name);
        var id = nextId++;
        ECS.Tags[name] = {};
        ECS.Tags[name].name = name;
        ECS.Tags[name].familyId = id; 
        ECS.Entity.prototype["set" + name] = function ()
        {
            var tag = {};
            tag.name = name;
            tag.familyId = id;
            this.data[tag.familyId] = tag;
            this['is' + tag.name] = function() { return true; };
            tag.entityId = this.id;
            return this;
        };

        ECS.Entity.prototype['is' + name] = function(){ return false; }
    }

    ECS.System = (function(){
        return function(name, obj)
        {
            obj.name = name;
            systems.push(obj);
        }
    })();

    ECS.init = (function(state)
    {
        entities = [];
        ECS.Events.clear();
        systems.sort(function(a, b){
            return a.order - b.order;
        });
        state.systems = {};
        for(var i = 0; i < systems.length; ++i)
        {
            var system = systems[i];
            console.log("init", system.name);
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

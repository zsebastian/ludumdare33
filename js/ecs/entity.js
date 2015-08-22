ECS.GenerateId = (function(){
    var nextId = 0;

    return function()
    {
        return nextId++;
    }
    
})();

ECS.Entity = function Entity()
{
   this.id = ECS.GenerateId(); 
   this.data = {}
   
   return this;
}

ECS.Entity.prototype.has = function (component)
{
    this.data[component.familyId] = component;
    this.data[component.name] = component;
    this['get' + component.name] = component;
    this['has' + component.name] = function() 
    {
        return true;
    }
    return this;
}

ECS.Entity.prototype.is = function (tag)
{
    this.data[tag.familyId] = component;
    this.data[tag.name] = component;
    this['get' + tag.name] = tag;
    this['is' + tag.name] = function()
    {
        return true; 
    };

    return this;
}

ECS.Entity.prototype.match()
{
    for(var i = 0; i < arguments.length; ++i)
    {
        if (!this.data[arguments[i])
        {
            return false;
        }
    }
    return true;
}

ECS.Entity.prototype.toString = function toString() 
{
    console.log(JSON.stringify(this, null, 4));
    return this;
}

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
   this.data = new Array(ECS.registeredComponents);
   
   return this;
};

ECS.Entity.prototype.match = function()
{
    for(var i = 0; i < arguments.length; ++i)
    {
        var comp = arguments[i];
        if (!comp)
        {
            console.log(comp)
        }
        if (!this.data[comp.familyId])
        {
            return false;
        }
    }
    return true;
};

ECS.Entity.prototype.print = function print() 
{
    var str = this.id + ': ';
    for(var i = 0; i < this.data.length; ++i)
    {
        var d = this.data[i];
        if (d)
        {
            str += d.name;
            if (i != this.data.length - 1)
            {
                str += ' | ';
            }
        }
    }
    console.log(str);
    return this;
};

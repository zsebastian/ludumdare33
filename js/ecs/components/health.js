ECS.Component("Health", function (ret, maxHealth, startHealth)
{
    ret.health = startHealth || maxHealth;
    ret.maxHealth = maxHealth;
});

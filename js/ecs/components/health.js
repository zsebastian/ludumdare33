ECS.Component("Health", function (ret, maxHealth, startHealth)
{
    ret.zombieBitten = false;
    ret.health = startHealth || maxHealth;
    ret.maxHealth = maxHealth;
    ret.blink = 0;
});

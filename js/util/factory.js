Util.Factory = (function(){
    var bounds = [7, 5]
    return {
        zombie: function(chars, position) {
            var e = ECS.Entities.create().
                addTransform(position, bounds).
                addSprite(chars, [16, 16], [0, 0]).
                addMovement(15, 80, 100).
                addAnimation([0, 0]).
                addAI(Util.AI.Zombie).
                addDirection().
                addZombieDash(250).
                addZombieBite(50, 10, [20, 20]).
                addHealth(1).
                addTeam(0);
        },

        player: function(chars, position) {
            var e = ECS.Entities.create().
                setPlayer().
                addTransform(position, bounds).
                addSprite(chars, [16, 16], [0, 0]).
                addMovement(20, 80, 100).
                addAnimation([0, 0]).
                addDirection().
                addZombieDash(250).
                addZombieBite(50, 8, [20, 20]).
                addHealth(1).
                addTeam(0);
        },

        batGuy: function(chars, position) {
            var e = ECS.Entities.create().
                setEnemy().
                addTransform(position, bounds).
                addSprite(chars, [16, 16], [32 * 5, 0]).
                addMovement(25, 80, 100).
                addAnimation([5, 0]).
                addDirection().
                addAI(Util.AI.BatGuy).
                addHealth(2).
                addBat(1, 14, [28, 28]).
                addTeam(1);
        },

        bloodPool: function(chars, position, tileNr) {
            var e = ECS.Entities.create().
                addTransform(position, [5, 7]).
                addSprite(chars, [16, 16], [32 * 10, 32 * tileNr]);
            //This should work, but it doesn't. I have no idea what
            //happens to this entity and why.
        }
    }
})();

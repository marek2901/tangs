var Player = function (game) {
    this.game = game;
    this.cannon_path = 'images/player/cannon.png';
    this.tank_path = 'images/player/tank.png';
    console.log("Player initialized");
}

Player.prototype = {
    create: function () {
        // TODO create player as a group of sprites
    },
    pointCanon: function (targetX, targetY) {
        // TODO point cannon to target
    },
    shoot: function () {
        // TODO shoot target
    }
}

var Enemy = function (game) {
    this.game = game;
    this.cannon_path = 'images/enemy/cannon.png';
    this.tank_path = 'images/enemy/tank.png';
    console.log("Enemy initialized");
}

Enemy.prototype = Player.prototype;

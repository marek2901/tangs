var Player = function (game) {
    this.game = game;

    this.baseAngle = 90;

    this.cannon_path = 'images/player/cannon.png';
    this.cannon_name = 'player_cannon';
    this.tank_path = 'images/player/tank.png';
    this.tank_name = 'player_tank';

    this.game.load.image(this.cannon_name, this.cannon_path);
    this.game.load.image(this.tank_name, this.tank_path);
    console.log("Player initialized");
}

Player.prototype = {
    spawn: function (posX, poxY) {
        this.tank = TanksUtil.insertCentered(
            this.game, posX, poxY, this.tank_name
        );
        this.tank.angle = this.baseAngle;
        this.cannon = TanksUtil.insertCentered(
            this.game, posX, poxY, this.cannon_name
        );
        this.cannon.anchor.setTo(0.5, 0.6);
        this.cannon.angle = this.baseAngle;
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

    this.baseAngle = 270;

    this.cannon_path = 'images/enemy/cannon.png';
    this.cannon_name = 'enemy_cannon';
    this.tank_path = 'images/enemy/tank.png';
    this.tank_name = 'enemy_tank';

    this.game.load.image(this.cannon_name, this.cannon_path);
    this.game.load.image(this.tank_name, this.tank_path);
    console.log("Enemy initialized");
}

Enemy.prototype = Player.prototype;

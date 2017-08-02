var Player = function (game, onDead) {
    this.game = game;
    this.onDeadCallback = onDead;

    this.baseAngle = 90;
    this.nextFire = 0;
    this.fireRate = 500;
    this.basePercAccess = 0;

    this.pointx = TanksUtil.porcentX.call(this, 100);
    this.pointy = TanksUtil.porcentY.call(this, 50);

    this.cannon_path = 'images/player/cannon.png';
    this.cannon_name = 'player_cannon';
    this.tank_path = 'images/player/tank.png';
    this.tank_name = 'player_tank';
    this.bullet_path = 'images/player/bullet.png'
    this.bullet_name = 'player_bullet'

    this.game.load.image(this.cannon_name, this.cannon_path);
    this.game.load.image(this.tank_name, this.tank_path);
    this.game.load.image(this.bullet_name, this.bullet_path);
    console.log("Player initialized");
}

Player.prototype = {
    spawn: function (posX, poxY) {
        this.tank = TanksUtil.insertCentered(
            this.game, posX, poxY, this.tank_name
        );
        this.tank.angle = this.baseAngle;
        this.game.physics.enable(this.tank, Phaser.Physics.ARCADE);

        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

        this.bullets.createMultiple(50, this.bullet_name);
        this.bullets.setAll('checkWorldBounds', true);
        this.bullets.setAll('outOfBoundsKill', true);

        this.cannon = TanksUtil.insertCentered(
            this.game, posX, poxY, this.cannon_name
        );
        this.cannon.anchor.setTo(0.5, 0.6);
        this.cannon.angle = this.baseAngle;
        this.resetStats();
        this.createHealthBar(posX, poxY);
    },
    createHealthBar: function (posx, posy) {
        var options = {
            width: 100,
            height: 10,
            x: posx,
            y: posy - 50,
            bg: {
                color: '#651828'
            },
            bar: {
                color: '#00FF00'
            },
            animationDuration: 200,
            flipped: false
        };
        this.myHealthBar = new HealthBar(this.game, options);
    },
    resetStats: function () {
        this.life = 100;
    },
    pointCanon: function (targetX, targetY) {
        var angleDeg = Math.atan2(
            targetY - this.cannon.y, targetX - this.cannon.x
        ) * 180 / Math.PI;
        this.cannon.angle = 90 + angleDeg;
        this.pointx = targetX;
        this.pointy = targetY;
    },
    move: function (deltaX, deltaY) {
        if (this.tank.x + deltaX > TanksUtil.porcentX.call(this, this.basePercAccess + 0) &&
            this.tank.x + deltaX < TanksUtil.porcentX.call(this, this.basePercAccess + 50) &&
            this.tank.y + deltaY < TanksUtil.porcentY.call(this, 100) &&
            this.tank.y + deltaY > TanksUtil.porcentY.call(this, 0)) {

            this.tank.x += deltaX;
            this.cannon.x += deltaX;

            this.tank.y += deltaY;
            this.cannon.y += deltaY;
            this.pointy += deltaY;
            this.pointx += deltaX;
            this.myHealthBar.setPosition(this.tank.x, this.tank.y - 50);
        }
    },
    shoot: function () {
        if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0) {
            this.nextFire = this.game.time.now + this.fireRate;
            var bullet = this.bullets.getFirstDead();
            bullet.anchor.setTo(0.5, 0.5);

            bullet.reset(this.cannon.x, this.cannon.y);

            this.game.physics.arcade.moveToXY(
                bullet, this.pointx, this.pointy, 300);
        }
    },
    gotShot: function () {
        this.life -= 1;
        console.log(this.life);
        if (this.life <= 0) {
            this.tank.destroy(true);
            this.cannon.destroy(true);
            this.onDeadCallback(this);
            this.myHealthBar.kill();
        } else {
            this.myHealthBar.setPercent(this.life);
        }
    }
}

var Enemy = function (game, onDead) {
    this.game = game;
    this.onDeadCallback = onDead;

    this.baseAngle = 270;
    this.nextFire = 0;
    this.fireRate = 500;
    this.basePercAccess = 50;

    this.pointx = 0;
    this.pointy = TanksUtil.porcentY.call(this, 50);

    this.cannon_path = 'images/enemy/cannon.png';
    this.cannon_name = 'enemy_cannon';
    this.tank_path = 'images/enemy/tank.png';
    this.tank_name = 'enemy_tank';
    this.bullet_path = 'images/enemy/bullet.png'
    this.bullet_name = 'enemy_bullet'

    this.game.load.image(this.cannon_name, this.cannon_path);
    this.game.load.image(this.tank_name, this.tank_path);
    this.game.load.image(this.bullet_name, this.bullet_path);
    console.log("Enemy initialized");
}

Enemy.prototype = Player.prototype;

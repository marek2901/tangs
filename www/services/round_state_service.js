var StateServiceHelper = {
    clear: function () {
        this.enemies.forEach(function (enemy) {
            enemy.kill();
        }.bind(this))
        this.enemies = [];
        this.player.kill();
        this.player = null;
    },
    create: function (enemiesNum) {
        this.player = new Player(this.game, function () {
            this._end_round(false);
        }.bind(this));

        this.enemies = [];
        var _this = this;
        for (var index = 0; index < enemiesNum; index++) {
            this.enemies[index] = new Enemy(this.game, function (enemy) {
                var index = _this.enemies.indexOf(enemy);

                if (index > -1) {
                    _this.enemies.splice(index, 1);
                }
                if (_this.enemies.length <= 0) {
                    _this._end_round(true);
                }
            });
        }
    },
    spawn: function () {
        this.player.spawn(
            TanksUtil.porcentX.call(this, 5),
            this.game.world.centerY
        );
        var perc = 40;
        this.enemies.forEach(function (enemy) {
            enemy.spawn(
                TanksUtil.porcentX.call(this, 95),
                TanksUtil.porcentY.call(this, perc)
            );
            perc += 20;
        }, this);
    }
}

var RoundStateService = function (game) {
    this.round_num = 1;
    this.game = game;
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    StateServiceHelper.create.call(this, 1);
    this.pause = false;
}

RoundStateService.prototype = {
    spawn_objects: function () {
        StateServiceHelper.spawn.call(this)
    },
    update: function () {
        if (this.pause) {
            return null;
        }
        try {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                this.player.move(-4, 0);
            } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                this.player.move(4, 0);
            }

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                this.player.move(0, -4);
            } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                this.player.move(0, 4);
            }
            var _this = this;
            this.enemies.forEach(function (enemy) {
                this.game.physics.arcade.overlap(this.player.tank, enemy.bullets, function (tank, bullets) {
                    _this.player.gotShot();
                });
                this.game.physics.arcade.overlap(this.player.bullets, enemy.tank, function (tank, bullets) {
                    enemy.gotShot();
                });
            }, this);
            this.player.shoot();

            if (this.game.input.mousePointer.isDown) {
                this.player.pointCanon(this.game.input.mousePointer.x, this.game.input.mousePointer.y)
            }
        } catch (error) {
            console.log(error);
        }
    },
    _end_round: function (winner) {
        this.pause = true;
        StateServiceHelper.clear.call(this);
        StateServiceHelper.create.call(this, 2);
        StateServiceHelper.spawn.call(this);
        this.pause = false;
    }
}

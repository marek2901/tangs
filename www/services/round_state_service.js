var RoundStateService = function (game) {
    this.round_num = 1;
    this.game = game;
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.player = new Player(this.game, function () {
        alert('Game Over');
    });

    this.enemies = [];
    var _this = this;
    for (var index = 0; index < 3; index++) {
        this.enemies[index] = new Enemy(this.game, function (enemy) {
            alert('Scored !!');
            var index = _this.enemies.indexOf(enemy);

            if (index > -1) {
                _this.enemies.splice(index, 1);
            }
        });
    }
}

RoundStateService.prototype = {
    spawn_objects: function () {
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
    },
    update: function () {
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
        } catch (error) {
            console.log(error);
        }
    },
    _end_round: function () {
        // TODO end roudn and go to next if all enemies are dead or go to game over if player is dead
        // if no next state available end game as a winner
    }
}

var DifficultyHelper = function (baseNum) {
    this.baseNum = baseNum;
}

DifficultyHelper.prototype = {
    getNoOfEnemies: function () {
        return (this.baseNum % 3) + 1;
    },
    getDiffucultyNumber: function () {
        return (0.2 * parseInt(this.baseNum / 3))
    },
    levelUp: function () {
        this.baseNum += 1;
    }
}

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
    },
    createAI: function () {
        this.aiControllers = [];
        for (var index = 0; index < 3; index++) {
            this.aiControllers[index] = new AIController();
        }
    }
}

var RoundStateService = function (game) {
    StateServiceHelper.createAI.call(this);
    this.levelHelper = new DifficultyHelper(0);
    this.game = game;
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    StateServiceHelper.create.call(this, this.levelHelper.getNoOfEnemies());
    this.pause = false;
    this.baseShot = 5;
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
            this.enemies.forEach(function (enemy, index) {
                this.aiControllers[index].onUpdate({
                    move: function (x, y) {
                        enemy.move(x, y);
                    },
                    shoot: function () {
                        enemy.shoot();
                    },
                    pointCanon: function (x, y) {
                        // TODO
                    }
                });

                this.game.physics.arcade.overlap(this.player.tank, enemy.bullets, function (tank, bullets) {
                    _this.player.gotShot(_this.baseShot + _this.levelHelper.getDiffucultyNumber());
                });
                this.game.physics.arcade.overlap(this.player.bullets, enemy.tank, function (tank, bullets) {
                    enemy.gotShot(Math.max(0.1, (_this.baseShot - _this.levelHelper.getDiffucultyNumber())));
                });
            }, this);
            this.player.shoot();
            this.enemies[0].shoot();

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
        if (winner) {
            this.levelHelper.levelUp();
            StateServiceHelper.create.call(this, this.levelHelper.getNoOfEnemies());
            StateServiceHelper.spawn.call(this);
            this.pause = false;
        } else {
            alert('You lost !!!!');
        }
    }
}

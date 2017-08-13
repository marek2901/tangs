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
    },
    createJoyStick: function () {
        this.game.load.atlas('generic', 'images/generic-joystick.png', 'images/generic-joystick.json');
    },
    spawnJoyStick: function () {
        this.pad = this.game.plugins.add(Phaser.VirtualJoystick);
        this.stick = this.pad.addStick(0, 0, 150, 'generic');
        this.stick.alignBottomLeft(20);
        this.joyAdapter = new JoyStickAdapter(this.stick);

        this.buttonShoot = this.pad.addButton(100, 100, 'generic', 'button1-up', 'button1-down');
    },
    clearControls: function () {
        this.pad.destroy()
    }
}

var JoyStickAdapter = function (stick) {
    this.stick = stick;
}

JoyStickAdapter.prototype = {
    getJoyInput: function (callback) {

        if (this.stick.isDown) {
            // 3 or -3 is left
            left = this._distance(this.stick.rotation, 3)
            // 0 is right
            right = this._distance(this.stick.rotation, 0)
            // -1.5 is up
            up = this._distance(this.stick.rotation, 1.5)
            // 1.5 is down
            down = this._distance(this.stick.rotation, 1.5)

            x = Math.max(left, right) * 4
            if (Math.abs(this.stick.rotation) > 1.5) {
                x *= -1
            }
            y = Math.max(up, down) * 4
            if (this.stick.rotation < 0) {
                y *= -1
            }

            callback(x, y)
        }
    },
    _distance: function (n1, n2) {
        return Math.max(3, 4 - Math.min(4, Math.abs(Math.abs(n1) - Math.abs(n2)).toFixed(2)).toFixed(2)) - 3
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
    StateServiceHelper.createJoyStick.call(this);
}

RoundStateService.prototype = {
    spawn_objects: function () {
        StateServiceHelper.spawnJoyStick.call(this)
        StateServiceHelper.spawn.call(this)
    },
    update: function () {
        if (this.pause) {
            return null;
        }
        try {
            this.joyAdapter.getJoyInput(function (x, y) {
                this.player.move(x, y);
            }.bind(this))
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
            if(this.buttonShoot.isDown)
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
            StateServiceHelper.clearControls.call(this)
            this.game.state.start('PlayOverState')
        }
    }
}

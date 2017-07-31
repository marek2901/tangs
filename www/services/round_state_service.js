var RoundStateService = function (game) {
    this.round_num = 1;
    this.game = game;

    this.player = new Player(this.game);

    this.enemy = new Enemy(this.game);
}

RoundStateService.prototype = {
    spawn_objects: function () {
        this.player.spawn(
            TanksUtil.porcentX.call(this, 5),
            this.game.world.centerY
        );

        this.enemy.spawn(
            TanksUtil.porcentX.call(this, 95),
            this.game.world.centerY
        );
    },
    got_shot: function (player) {
        // TODO decrease player life and run game finished check
    },
    update: function () {
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
    },
    _end_round: function () {
        // TODO end roudn and go to next if all enemies are dead or go to game over if player is dead
        // if no next state available end game as a winner
    }
}

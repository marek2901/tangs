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
    _end_round: function () {
        // TODO end roudn and go to next if all enemies are dead or go to game over if player is dead
        // if no next state available end game as a winner
    }
}

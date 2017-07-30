var RoundStateService = function (game) {
    this.round_num = 1;
    this.game = game;
}

RoundStateService.prototype = {
    spawn_enemies: function () {
        // TODO spawn enemies
    },
    got_shot: function(player) {
        // TODO decrease player life and run game finished check
    },
    _end_round: function () {
        // TODO end roudn and go to next if all enemies are dead or go to game over if player is dead
        // if no next state available end game as a winner
    }
}

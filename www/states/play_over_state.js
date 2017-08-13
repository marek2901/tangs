var play_over_state = function (game) {
    console.log('Play Over state starting...')
}

play_over_state.prototype = {
    create: function () {
        TanksUtil.insertCentered(
            this.game, this.game.world.centerX, (this.game.height * 0.30), 'logo');

        start_btn = TanksUtil.insertCentered(
            this.game, this.game.world.centerX, (this.game.height * 0.70), 'start_button');
        start_btn.inputEnabled = true;
        start_btn.events.onInputDown.add(this.start_game, this);
    },
    preload: function () {
        this.game.load.image('logo', 'images/tanks_logo.jpg');
        this.game.load.image('start_button', 'images/start_game_button.png');
        // this.game.load.image('scores_button', 'images/best_scores_button.png');
    },
    start_game: function () {
        this.game.state.start('PlayState')
    },
    show_scores: function () {
        this.game.state.start('ScoresState')
    }
}

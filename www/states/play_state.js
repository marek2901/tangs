var play_state = function (game) {
    console.log('Starting gameplay xDD')
}

play_state.prototype = {
    preload: function () {
        this.round_service = new RoundStateService(this.game)
        this.game.load.image('background', 'images/backgrounds/bg_1.png');
    },
    create: function () {
        this.game.add.tileSprite(
            0, 0,
            this.game.world.width, this.game.world.height,
            'background'
        );
        this.round_service.spawn_objects()
    },
    update: function () {
        this.round_service.update();
    }
}

var splash_state = function (game) {
    console.log('TANK\'s wars are starting xDDD');
};

splash_state.prototype = {
    preload: function () {
        this.game.load.image('splash', 'images/tanks_logo.jpg')
    },
    create: function () {
        var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'splash');
        logo.anchor.setTo(0.5, 0.5);
    }
}

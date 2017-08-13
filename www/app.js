var startEvent = "DOMContentLoaded";

if (window.cordova) {
    startEvent = "deviceready";
}

document.addEventListener(startEvent, function () {
    var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'TankWars');

    game.state.add('SplashState', splash_state);
    game.state.add('MenuState', menu_state);
    game.state.add('PlayOverState', play_over_state);
    game.state.add('PlayState', play_state);
    game.state.start('SplashState');
});

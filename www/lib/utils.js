var TanksUtil = {
    insertCentered: function(game ,posX, posY, name){
        object = game.add.sprite(posX, posY, name);
        object.anchor.setTo(0.5, 0.5);
        return object;
    },
    porcentX: function (percent) {
        return this.game.world.width * (percent / 100)
    },
    porcentY: function (percent) {
        return this.game.world.height * (percent / 100)
    },
    getScale: function () {
        return window.innerHeight/687
    }
}

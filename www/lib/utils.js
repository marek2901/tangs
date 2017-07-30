var TanksUtil = {
    insertCentered: function(game ,posX, posY, name){
        object = game.add.sprite(posX, posY, name);
        object.anchor.setTo(0.5, 0.5);
        return object;
    }
}

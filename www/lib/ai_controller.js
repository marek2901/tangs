var AIController = function () {
    this.movesWeights = []; // Monte carlo way in TODO
    console.log('Ai Controller Instance created');
    this.possibleXMoves = [-1, -1 , 1] // up and down or left or right
    this.possibleYMoves = [-1, 1] // up and down or left or right
    this.moveCacheSize = 20;
    this.resetMoveCache();
}

AIController.prototype = {
    onUpdate: function (callbacks) {
        if (this.moveCounter > this.moveCacheSize) {
            this.resetMoveCache();
        }
        callbacks.move(this.cachedMove[0], this.cachedMove[1]);
        callbacks.shoot();
        this.moveCounter += 1;
    },
    resetMoveCache: function () {
        this.moveCounter = 0;
        this.cachedMove = [this.randomXMove(), this.randomYMove()]
    },
    randomXMove: function () {
        return this.possibleXMoves[Math.floor(Math.random() * this.possibleXMoves.length)];
    },
    randomYMove: function () {
        return this.possibleYMoves[Math.floor(Math.random() * this.possibleYMoves.length)];
    }
}

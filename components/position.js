var Position = function(x = 0, y = 0) {
    this.set(x, y);
    this.name = "Position";
}

Position.prototype.set = function(x, y) {
    this.x = x;
    this.y = y;
};

module.exports = Position;

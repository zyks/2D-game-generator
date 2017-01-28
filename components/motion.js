var Motion = function(xVelocity=10, yVelocity=10, maxVelocity) {
    this.set(xVelocity, yVelocity);
    this.maxVelocity = maxVelocity;
    this.name = "Motion";
}

Motion.prototype.set = function(x, y) {
    this.xVelocity = x;
    this.yVelocity = y;
}

module.exports = Motion;

var Motion = function(x_velocity=10, y_velocity=10, max_velocity) {
    this.set(x_velocity, y_velocity);
    this.max_velocity = max_velocity;
    this.name = "Motion";
}

Motion.prototype.set = function(x, y) {
    this.x_velocity = x;
    this.y_velocity = y;
}

module.exports = Motion;

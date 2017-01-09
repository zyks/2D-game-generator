PathBasedPrimitive = require('./pathBasedPrimitive');

Circle = function(x, y, radius) {
    PathBasedPrimitive.call(this, x, y);
    this.radius = radius;

    return this;
};

Circle.prototype = Object.create(PathBasedPrimitive.prototype);
Circle.constructor = Circle;

Circle.prototype.makePath = function(ctx, x, y) {
    ctx.beginPath();
    ctx.arc(this.x + x, this.y + y, this.radius, 0, Math.PI*2, true);
    ctx.closePath();
}

module.exports = Circle;

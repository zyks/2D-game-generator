PathBasedPrimitive = require('./pathBasedPrimitive');

Polygon = function(x, y, points) {
    PathBasedPrimitive.call(this, x, y);
    this.points = points;

    return this;
};

Polygon.prototype = Object.create(PathBasedPrimitive.prototype);
Polygon.constructor = Circle;

Polygon.prototype.makePath = function(ctx, x, y) {
    ctx.beginPath();
    let last = this.points[this.points.length - 1];
    ctx.moveTo(this.x + x + last[0], this.y + y + last[1]);
    for(let point of this.points) {
        ctx.lineTo(this.x + x + point[0], this.y + y + point[1]);
    }
    ctx.closePath();
}

module.exports = Polygon;

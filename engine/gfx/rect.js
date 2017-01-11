PathBasedPrimitive = require('./pathBasedPrimitive');

Rect = function(x, y, width, height) {
    PathBasedPrimitive.call(this, x, y);
    this.width = width;
    this.height = height;
    return this;
};

Rect.prototype = Object.create(PathBasedPrimitive.prototype);
Rect.constructor = Rect;

Rect.prototype.makePath = function(ctx, x, y) {
    ctx.beginPath();
    ctx.rect(this.x + x, this.y + y, this.width, this.height);
    ctx.closePath();
}

module.exports = Rect;

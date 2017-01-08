var Gfx = Gfx || {};

Gfx.Circle = function(x, y, radius) {
    Gfx.PathBasedPrimitive.call(this, x, y);
    this.radius = radius;

    return this;
};

Gfx.Circle.prototype = Object.create(Gfx.PathBasedPrimitive.prototype);
Gfx.Circle.constructor = Gfx.Circle;

Gfx.Circle.prototype.makePath = function(ctx, x, y) {
    ctx.beginPath();
    ctx.arc(this.x + x, this.y + y, this.radius, 0, Math.PI*2, true);
    ctx.closePath();
}

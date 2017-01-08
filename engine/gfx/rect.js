var Gfx = Gfx || {};

Gfx.Rect = function(x, y, width, height) {
    Gfx.PathBasedPrimitive.call(this, x, y);
    this.width = width;
    this.height = height;
    return this;
};

Gfx.Rect.prototype = Object.create(Gfx.PathBasedPrimitive.prototype);
Gfx.Rect.constructor = Gfx.Rect;

Gfx.Rect.prototype.makePath = function(ctx, x, y) {
    ctx.beginPath();
    ctx.rect(this.x + x, this.y + y, this.width, this.height);
    ctx.closePath();
}

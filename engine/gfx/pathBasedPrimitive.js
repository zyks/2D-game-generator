var Gfx = Gfx || {};

Gfx.PathBasedPrimitive = function(x, y) {
    Gfx.Primitive.call(this, x, y);
    return this;
};

Gfx.PathBasedPrimitive.prototype = Object.create(Gfx.Primitive.prototype);
Gfx.PathBasedPrimitive.constructor = Gfx.PathBasedPrimitive;

Gfx.PathBasedPrimitive.prototype.stroke = function(strokeStyle, strokeWidth) {
  this.strokeStyle = strokeStyle;
  this.strokeWidth = strokeWidth || 1;
  return this;
}

Gfx.PathBasedPrimitive.prototype.fill = function(fillStyle) {
  this.fillStyle = fillStyle;
  return this;
}

Gfx.PathBasedPrimitive.prototype.render = function(ctx, x, y) {
    this.makePath(ctx, x, y);
    if(this.fillStyle) {
        ctx.fillStyle = this.fillStyle;
        ctx.lineWidth = this.strokeWidth;
        ctx.fill();
    }
    if(this.strokeStyle) {
        ctx.strokeStyle = this.strokeStyle;
        ctx.stroke();
    }
}

Gfx.PathBasedPrimitive.prototype.makePath = function(ctx, x, y) {
    throw new Error("Gfx.PathBasedPrimitive.render : Can't call pure virtual method");
}
